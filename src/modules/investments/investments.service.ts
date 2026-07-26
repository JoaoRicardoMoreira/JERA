import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { InvestmentQueryDto } from './dto/investment-query.dto';
import {
  InvestmentContributionResponseDto,
  InvestmentOverviewResponseDto,
} from './dto/investment-response.dto';
import { UpsertInvestmentContributionDto } from './dto/upsert-investment-contribution.dto';
import { InvestmentContributionEntity } from './entities/investment-contribution.entity';
import {
  INVESTMENTS_REPOSITORY,
  InvestmentRepository,
} from './interfaces/investment-repository.interface';
import { InvestmentService } from './interfaces/investment-service.interface';
import { SELIC_RATE_PROVIDER, SelicRateProvider } from './interfaces/selic-rate-provider.interface';
import { InvestmentMapper, InvestmentTimelinePoint } from './mapper/investment.mapper';
import { InvestmentValidator } from './validators/investment.validator';

const MONTH_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

@Injectable()
export class InvestmentsService implements InvestmentService {
  constructor(
    @Inject(INVESTMENTS_REPOSITORY)
    private readonly investmentsRepository: InvestmentRepository,
    private readonly investmentValidator: InvestmentValidator,
    @Inject(SELIC_RATE_PROVIDER)
    private readonly selicRateProvider: SelicRateProvider,
  ) {}

  async getOverview(
    userId: string,
    query: InvestmentQueryDto,
  ): Promise<InvestmentOverviewResponseDto> {
    let [config, contributions] = await Promise.all([
      this.investmentsRepository.getOrCreateConfig(userId),
      this.investmentsRepository.findContributionsByUserId(userId),
    ]);
    contributions = await this.ensureContributionRates(userId, contributions);
    const latestContribution = this.latestContribution(contributions);
    const projectedMonthlyRate = latestContribution?.selicAnnualRatePercent
      ? InvestmentMapper.monthlyEquivalentPercent(latestContribution.selicAnnualRatePercent)
      : '0.0000';

    if (config.taxaMensalPercent !== projectedMonthlyRate) {
      config = await this.investmentsRepository.upsertConfig({
        userId,
        taxaMensalPercent: projectedMonthlyRate,
      });
    }

    return this.buildOverview(config, contributions, query);
  }

  async upsertContribution(
    userId: string,
    dto: UpsertInvestmentContributionDto,
  ): Promise<InvestmentContributionResponseDto> {
    const contributedAt = new Date(dto.contributedAt);
    this.investmentValidator.ensureContributionDateIsNotFuture(contributedAt);
    const selicRate = await this.selicRateProvider.getAnnualRateForDate(contributedAt);
    const contribution = await this.investmentsRepository.upsertContribution({
      userId,
      amount: dto.amount,
      contributedAt,
      month: contributedAt.getUTCMonth() + 1,
      year: contributedAt.getUTCFullYear(),
      selicAnnualRatePercent: selicRate.annualRatePercent,
      selicReferenceDate: selicRate.referenceDate,
    });
    await this.investmentsRepository.upsertConfig({
      userId,
      taxaMensalPercent: InvestmentMapper.monthlyEquivalentPercent(selicRate.annualRatePercent),
    });

    return InvestmentMapper.toContributionResponse(contribution);
  }

  async deleteContribution(userId: string, contributionId: string): Promise<void> {
    const wasDeleted = await this.investmentsRepository.softDeleteContribution(
      userId,
      contributionId,
    );

    this.investmentValidator.ensureContributionDeleted(wasDeleted);
  }

  private buildOverview(
    config: Awaited<ReturnType<InvestmentRepository['getOrCreateConfig']>>,
    contributions: InvestmentContributionEntity[],
    endAt: InvestmentQueryDto,
  ): InvestmentOverviewResponseDto {
    const timeline = this.buildTimeline(contributions, endAt);
    const currentContribution = contributions.find(
      (contribution) => contribution.month === endAt.month && contribution.year === endAt.year,
    );
    const totalAportado = contributions.reduce(
      (total, contribution) => total.plus(contribution.amount),
      new Prisma.Decimal(0),
    );

    return {
      config: InvestmentMapper.toConfigResponse(config),
      contributions: contributions.map(InvestmentMapper.toContributionResponse),
      currentContribution: currentContribution
        ? InvestmentMapper.toContributionResponse(currentContribution)
        : null,
      timeline: timeline.map(InvestmentMapper.toTimelineResponse),
      totalAportado: totalAportado.toFixed(2),
      patrimonioFinal:
        timeline.length > 0
          ? timeline[timeline.length - 1].patrimonio
          : new Prisma.Decimal(0).toFixed(2),
      annualEquivalentPercent: Number(
        this.latestContribution(contributions)?.selicAnnualRatePercent ?? 0,
      ),
    };
  }

  private buildTimeline(
    contributions: InvestmentContributionEntity[],
    endAt: InvestmentQueryDto,
  ): InvestmentTimelinePoint[] {
    const withValue = contributions.filter((contribution) =>
      new Prisma.Decimal(contribution.amount).greaterThan(0),
    );

    if (withValue.length === 0) {
      return [];
    }

    const sorted = withValue
      .slice()
      .sort((a, b) => this.monthKey(a.year, a.month).localeCompare(this.monthKey(b.year, b.month)));
    const first = sorted[0];
    const lastFromData = sorted[sorted.length - 1];
    const last =
      this.monthKey(endAt.year, endAt.month).localeCompare(
        this.monthKey(lastFromData.year, lastFromData.month),
      ) > 0
        ? endAt
        : { year: lastFromData.year, month: lastFromData.month };
    return this.listMonthRange(
      { year: first.year, month: first.month },
      { year: last.year, month: last.month },
    ).map(({ year, month }) => {
      const key = this.monthKey(year, month);
      const valuationDate = new Date(Date.UTC(year, month - 1, 1, 23, 59, 59, 999));
      const contributionsToDate = contributions.filter(
        (contribution) => contribution.contributedAt <= valuationDate,
      );
      const aporte = contributions
        .filter((contribution) => contribution.year === year && contribution.month === month)
        .reduce((sum, contribution) => sum.plus(contribution.amount), new Prisma.Decimal(0));
      const patrimonio = contributionsToDate
        .reduce((sum, contribution) => {
          const months = this.fullMonthsBetween(contribution.contributedAt, valuationDate);
          const monthlyRate = new Prisma.Decimal(
            InvestmentMapper.monthlyEquivalentPercent(contribution.selicAnnualRatePercent ?? '0'),
          ).dividedBy(100);
          const accumulated = new Prisma.Decimal(contribution.amount).times(
            monthlyRate.plus(1).pow(months),
          );
          return sum.plus(accumulated);
        }, new Prisma.Decimal(0))
        .toDecimalPlaces(2);

      return {
        key,
        year,
        month,
        label: this.formatMonthLabel(year, month),
        aporte: aporte.toFixed(2),
        patrimonio: patrimonio.toFixed(2),
      };
    });
  }

  private fullMonthsBetween(start: Date, end: Date): number {
    const monthDifference =
      (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
      end.getUTCMonth() -
      start.getUTCMonth();
    const incompleteMonth = end.getUTCDate() < start.getUTCDate() ? 1 : 0;

    return Math.max(0, monthDifference - incompleteMonth);
  }

  private async ensureContributionRates(
    userId: string,
    contributions: InvestmentContributionEntity[],
  ): Promise<InvestmentContributionEntity[]> {
    return Promise.all(
      contributions.map(async (contribution) => {
        if (contribution.selicAnnualRatePercent && contribution.selicReferenceDate) {
          return contribution;
        }

        const selicRate = await this.selicRateProvider.getAnnualRateForDate(
          contribution.contributedAt,
        );

        return this.investmentsRepository.setContributionSelicRate({
          userId,
          contributionId: contribution.id,
          selicAnnualRatePercent: selicRate.annualRatePercent,
          selicReferenceDate: selicRate.referenceDate,
        });
      }),
    );
  }

  private latestContribution(
    contributions: InvestmentContributionEntity[],
  ): InvestmentContributionEntity | null {
    return (
      contributions
        .slice()
        .sort((a, b) => b.contributedAt.getTime() - a.contributedAt.getTime())[0] ?? null
    );
  }

  private monthKey(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  private formatMonthLabel(year: number, month: number): string {
    return `${MONTH_SHORT[month - 1]}/${year}`;
  }

  private listMonthRange(
    start: { year: number; month: number },
    end: { year: number; month: number },
  ): Array<{ year: number; month: number }> {
    const months: Array<{ year: number; month: number }> = [];
    let current = { ...start };
    const endKey = this.monthKey(end.year, end.month);

    while (this.monthKey(current.year, current.month) <= endKey) {
      months.push({ ...current });
      current =
        current.month === 12
          ? { year: current.year + 1, month: 1 }
          : { year: current.year, month: current.month + 1 };
    }

    return months;
  }
}
