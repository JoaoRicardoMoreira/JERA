import { InvestmentConfig, InvestmentContribution, Prisma } from '@prisma/client';

import {
  InvestmentConfigResponseDto,
  InvestmentContributionResponseDto,
  InvestmentTimelinePointResponseDto,
} from '../dto/investment-response.dto';
import { InvestmentConfigEntity } from '../entities/investment-config.entity';
import { InvestmentContributionEntity } from '../entities/investment-contribution.entity';

export interface InvestmentTimelinePoint {
  key: string;
  year: number;
  month: number;
  label: string;
  aporte: string;
  patrimonio: string;
}

export class InvestmentMapper {
  static toConfigEntity(config: InvestmentConfig): InvestmentConfigEntity {
    return new InvestmentConfigEntity(
      config.id,
      config.userId,
      new Prisma.Decimal(config.monthlyRatePercent).toFixed(4),
      config.createdAt,
      config.updatedAt,
      config.deletedAt,
    );
  }

  static toContributionEntity(contribution: InvestmentContribution): InvestmentContributionEntity {
    return new InvestmentContributionEntity(
      contribution.id,
      contribution.userId,
      new Prisma.Decimal(contribution.amount).toFixed(2),
      contribution.contributedAt,
      contribution.month,
      contribution.year,
      contribution.selicAnnualRatePercent
        ? new Prisma.Decimal(contribution.selicAnnualRatePercent).toFixed(4)
        : null,
      contribution.selicReferenceDate,
      contribution.createdAt,
      contribution.updatedAt,
      contribution.deletedAt,
    );
  }

  static toConfigResponse(config: InvestmentConfigEntity): InvestmentConfigResponseDto {
    return {
      id: config.id,
      taxaMensalPercent: config.taxaMensalPercent,
      createdAt: config.createdAt.toISOString(),
      updatedAt: config.updatedAt.toISOString(),
    };
  }

  static toContributionResponse(
    contribution: InvestmentContributionEntity,
  ): InvestmentContributionResponseDto {
    return {
      id: contribution.id,
      amount: contribution.amount,
      contributedAt: contribution.contributedAt.toISOString(),
      month: contribution.month,
      year: contribution.year,
      selicAnnualRatePercent: contribution.selicAnnualRatePercent,
      selicReferenceDate: contribution.selicReferenceDate?.toISOString() ?? null,
      monthlyEquivalentRatePercent: contribution.selicAnnualRatePercent
        ? InvestmentMapper.monthlyEquivalentPercent(contribution.selicAnnualRatePercent)
        : null,
      createdAt: contribution.createdAt.toISOString(),
      updatedAt: contribution.updatedAt.toISOString(),
    };
  }

  static toTimelineResponse(point: InvestmentTimelinePoint): InvestmentTimelinePointResponseDto {
    return point;
  }

  static monthlyEquivalentPercent(annualRatePercent: string): string {
    const annualRate = Number(annualRatePercent) / 100;
    const monthlyRate = (Math.pow(1 + annualRate, 1 / 12) - 1) * 100;

    return new Prisma.Decimal(monthlyRate).toDecimalPlaces(4).toFixed(4);
  }
}
