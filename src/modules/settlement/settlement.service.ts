import { Injectable } from '@nestjs/common';
import {
  FinancialGoalCategory,
  FinancialGoalStatus,
  PayableStatus,
  Prisma,
  SettlementJourneyStatus,
  SettlementJourneyType,
  SettlementJourneyUnit,
  TransactionType,
} from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { DashboardServiceImpl } from '../dashboard/dashboard.service';
import { SettlementOverviewDto } from './dto/settlement-overview.dto';
import {
  median,
  resolveAtmosphere,
  resolveDistrictLevel,
  resolveStage,
  roundedJourneyTarget,
  scoreSettlement,
  SETTLEMENT_RULES_VERSION,
} from './settlement.rules';

type Period = { month: number; year: number };

type FinancialHistory = Awaited<ReturnType<SettlementService['loadHistory']>>;

const DISTRICTS = [
  {
    key: 'GREAT_HALL',
    label: 'Grande Salão',
    description: 'Representa o crescimento do patrimônio.',
    field: 'hallPoints',
  },
  {
    key: 'GRANARY',
    label: 'Celeiro',
    description: 'Protege a aldeia por meio da reserva de emergência.',
    field: 'granaryPoints',
  },
  {
    key: 'HARBOR',
    label: 'Porto',
    description: 'Cresce junto com os investimentos.',
    field: 'harborPoints',
  },
  {
    key: 'MARKET',
    label: 'Mercado',
    description: 'Reflete a constância das receitas.',
    field: 'marketPoints',
  },
  {
    key: 'PALISADE',
    label: 'Paliçada',
    description: 'Fortalece-se com orçamento e controle de gastos.',
    field: 'palisadePoints',
  },
  {
    key: 'HALL_OF_ACHIEVEMENTS',
    label: 'Salão das Conquistas',
    description: 'Guarda cada objetivo cultivado.',
    field: 'achievementPoints',
  },
  {
    key: 'LIGHTHOUSE',
    label: 'Farol',
    description: 'Orienta compromissos e ciclos futuros.',
    field: 'lighthousePoints',
  },
] as const;

@Injectable()
export class SettlementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardService: DashboardServiceImpl,
  ) {}

  async getOverview(userId: string): Promise<SettlementOverviewDto> {
    const now = new Date();
    const currentPeriod = { month: now.getUTCMonth() + 1, year: now.getUTCFullYear() };
    const profile = await this.prisma.settlementProfile.upsert({
      where: { userId },
      update: { rulesVersion: SETTLEMENT_RULES_VERSION },
      create: { userId, rulesVersion: SETTLEMENT_RULES_VERSION },
    });
    const history = await this.loadHistory(userId);
    const snapshots = await this.reconcileSnapshots(userId, currentPeriod, history);
    const current =
      snapshots.find(
        (snapshot) =>
          snapshot.month === currentPeriod.month && snapshot.year === currentPeriod.year,
      ) ?? snapshots[snapshots.length - 1];
    const previous = snapshots
      .filter((snapshot) => this.periodKey(snapshot) < this.periodKey(currentPeriod))
      .at(-1);
    const currentIncomeBase = median(
      snapshots
        .filter((snapshot) => this.periodKey(snapshot) < this.periodKey(currentPeriod))
        .slice(-3)
        .map((snapshot) => Number(snapshot.totalIncome)),
    );
    const journeys = await this.reconcileJourneys(
      userId,
      currentPeriod,
      current,
      previous ? Number(previous.totalPatrimony) : 0,
      currentIncomeBase,
      history,
      now,
    );
    const reconstructedAt =
      profile.reconstructedAt ??
      (
        await this.prisma.settlementProfile.update({
          where: { userId },
          data: { reconstructedAt: now },
        })
      ).reconstructedAt ??
      now;

    const totals = snapshots.reduce(
      (accumulator, snapshot) => ({
        developmentPoints: accumulator.developmentPoints + snapshot.developmentPoints,
        hallPoints: accumulator.hallPoints + snapshot.hallPoints,
        granaryPoints: accumulator.granaryPoints + snapshot.granaryPoints,
        harborPoints: accumulator.harborPoints + snapshot.harborPoints,
        marketPoints: accumulator.marketPoints + snapshot.marketPoints,
        palisadePoints: accumulator.palisadePoints + snapshot.palisadePoints,
        achievementPoints: accumulator.achievementPoints + snapshot.achievementPoints,
        lighthousePoints: accumulator.lighthousePoints + snapshot.lighthousePoints,
      }),
      {
        developmentPoints: 0,
        hallPoints: 0,
        granaryPoints: 0,
        harborPoints: 0,
        marketPoints: 0,
        palisadePoints: 0,
        achievementPoints: 0,
        lighthousePoints: 0,
      },
    );
    const stage = resolveStage(totals.developmentPoints);
    const patrimonyDelta = new Prisma.Decimal(current.totalPatrimony).minus(
      previous?.totalPatrimony ?? 0,
    );
    const districts = DISTRICTS.map((district) => {
      const points = totals[district.field];
      return {
        key: district.key,
        label: district.label,
        description: district.description,
        points,
        ...resolveDistrictLevel(points),
      };
    });

    return {
      stage,
      atmosphere: {
        state: current.atmosphere,
        reason: current.atmosphereReason,
      },
      patrimony: new Prisma.Decimal(current.totalPatrimony).toFixed(2),
      patrimonyDelta: patrimonyDelta.toFixed(2),
      availableBalance: new Prisma.Decimal(current.availableBalance).toFixed(2),
      investmentValue: new Prisma.Decimal(current.investmentValue).toFixed(2),
      goalReserveValue: new Prisma.Decimal(current.goalReserveValue).toFixed(2),
      fenrirMessage: this.fenrirMessage(current.atmosphere, journeys),
      nextExpansion:
        stage.nextStageLabel === null
          ? 'Seu reino continua florescendo a cada novo ciclo.'
          : `${stage.pointsToNextStage} marcas de jornada até ${stage.nextStageLabel}.`,
      districts,
      journeys: journeys.map((journey) => this.toJourneyResponse(journey)),
      reconstructedAt: reconstructedAt.toISOString(),
    };
  }

  private async loadHistory(userId: string) {
    const [transactions, investmentContributions, financialGoals, budgets, payables, recurrences] =
      await Promise.all([
        this.prisma.transaction.findMany({
          where: { userId, deletedAt: null },
          select: {
            amount: true,
            type: true,
            categoryId: true,
            occurredAt: true,
          },
          orderBy: { occurredAt: 'asc' },
        }),
        this.prisma.investmentContribution.findMany({
          where: { userId, deletedAt: null },
          orderBy: { contributedAt: 'asc' },
        }),
        this.prisma.financialGoal.findMany({
          where: {
            userId,
            deletedAt: null,
            status: { not: FinancialGoalStatus.CANCELLED },
          },
          include: {
            contributions: {
              where: { deletedAt: null },
              orderBy: { contributedAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        }),
        this.prisma.goal.findMany({
          where: { userId, deletedAt: null },
          orderBy: [{ year: 'asc' }, { month: 'asc' }],
        }),
        this.prisma.payable.findMany({
          where: {
            userId,
            deletedAt: null,
            status: { not: PayableStatus.CANCELLED },
          },
          orderBy: { dueDate: 'asc' },
        }),
        this.prisma.recurrence.findMany({
          where: { userId, deletedAt: null },
          orderBy: { startDate: 'asc' },
        }),
      ]);

    return {
      transactions,
      investmentContributions,
      financialGoals,
      budgets,
      payables,
      recurrences,
    };
  }

  private async reconcileSnapshots(
    userId: string,
    currentPeriod: Period,
    history: FinancialHistory,
  ) {
    const existing = await this.prisma.settlementMonthlySnapshot.findMany({
      where: { userId },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });
    const existingByPeriod = new Map(existing.map((item) => [this.periodKey(item), item]));
    const periods = this.periodsFrom(this.earliestPeriod(history, currentPeriod), currentPeriod);
    const projectedCurrent = await this.dashboardService.getMonthlySummary(userId, currentPeriod);
    const computed: typeof existing = [];
    const incomes: number[] = [];

    for (const period of periods) {
      const start = this.periodStart(period);
      const end = this.periodEnd(period);
      const isCurrent = this.periodKey(period) === this.periodKey(currentPeriod);
      const old = existingByPeriod.get(this.periodKey(period));
      if (!isCurrent && old?.isClosed && old.rulesVersion === SETTLEMENT_RULES_VERSION) {
        computed.push(old);
        incomes.push(Number(old.totalIncome));
        continue;
      }
      const periodTransactions = history.transactions.filter(
        (item) => item.occurredAt >= start && item.occurredAt < end,
      );
      const transactionIncome = this.sum(
        periodTransactions
          .filter((item) => item.type === TransactionType.INCOME)
          .map((item) => item.amount),
      );
      const transactionExpense = this.sum(
        periodTransactions
          .filter((item) => item.type === TransactionType.EXPENSE)
          .map((item) => item.amount),
      );
      const investmentContribution = this.sum(
        history.investmentContributions
          .filter((item) => item.contributedAt >= start && item.contributedAt < end)
          .map((item) => item.amount),
      );
      const goalContributions = history.financialGoals.flatMap((goal) =>
        goal.contributions
          .filter((item) => item.contributedAt >= start && item.contributedAt < end)
          .map((item) => ({ ...item, category: goal.category })),
      );
      const goalContribution = this.sum(goalContributions.map((item) => item.amount));
      const totalIncome = isCurrent ? Number(projectedCurrent.totalIncome) : transactionIncome;
      const totalExpense = isCurrent ? Number(projectedCurrent.totalExpense) : transactionExpense;
      const availableBalance = isCurrent
        ? Number(projectedCurrent.balance)
        : totalIncome - totalExpense - investmentContribution - goalContribution;
      const investmentValue = this.investmentValueAt(history, new Date(end.getTime() - 1));
      const goalReserveValue = this.goalReserveAt(history, end);
      const totalPatrimony = availableBalance + investmentValue + goalReserveValue;
      const previous = computed.at(-1);
      const previousPatrimony = previous ? Number(previous.totalPatrimony) : null;
      const budgets = history.budgets.filter(
        (item) => item.month === period.month && item.year === period.year,
      );
      const spendingByCategory = new Map<string, number>();
      periodTransactions
        .filter((item) => item.type === TransactionType.EXPENSE && item.categoryId)
        .forEach((item) => {
          const categoryId = item.categoryId as string;
          spendingByCategory.set(
            categoryId,
            (spendingByCategory.get(categoryId) ?? 0) + Number(item.amount),
          );
        });
      const periodPayables = history.payables.filter(
        (item) => item.competenceMonth === period.month && item.competenceYear === period.year,
      );
      const onTimePayables = periodPayables.filter(
        (item) =>
          item.status === PayableStatus.PAID &&
          Boolean(item.paidAt) &&
          (item.paidAt as Date).getTime() <= this.endOfDay(item.dueDate).getTime(),
      );
      const emergencyReserveValue = this.emergencyReserveAt(history, end);
      const completedGoals = history.financialGoals.filter(
        (goal) =>
          goal.status === FinancialGoalStatus.COMPLETED &&
          goal.updatedAt >= start &&
          goal.updatedAt < end,
      ).length;
      const consecutiveIncomeMonths =
        totalIncome > 0
          ? [...incomes.slice(-2), totalIncome].filter((value) => value > 0).length
          : 0;
      const score = scoreSettlement({
        totalIncome,
        totalExpense,
        previousPatrimony,
        totalPatrimony,
        medianIncome: median(incomes.slice(-3)),
        budgetCount: budgets.length,
        respectedBudgetCount: budgets.filter(
          (budget) => (spendingByCategory.get(budget.categoryId) ?? 0) <= Number(budget.amount),
        ).length,
        payableCount: periodPayables.length,
        onTimePayableCount: onTimePayables.length,
        investmentContribution,
        goalContribution,
        emergencyContribution: this.sum(
          goalContributions
            .filter((item) => item.category === FinancialGoalCategory.EMERGENCY_RESERVE)
            .map((item) => item.amount),
        ),
        emergencyReserveValue,
        investmentValue,
        completedGoals,
        consecutiveIncomeMonths,
        hasRecurrences: history.recurrences.some(
          (item) => item.startDate < end && (!item.endDate || item.endDate >= start),
        ),
      });
      const overdueCount = periodPayables.filter(
        (item) =>
          item.status === PayableStatus.PENDING && item.dueDate < (isCurrent ? new Date() : end),
      ).length;
      const atmosphere = resolveAtmosphere({
        balance: availableBalance,
        totalIncome,
        totalExpense,
        patrimonyDelta: previousPatrimony === null ? 0 : totalPatrimony - previousPatrimony,
        overdueCount,
      });
      const maximum = (field: keyof typeof score) =>
        Math.max(Number(old?.[this.snapshotField(field)] ?? 0), score[field]);
      const snapshot = await this.prisma.settlementMonthlySnapshot.upsert({
        where: {
          userId_year_month: {
            userId,
            year: period.year,
            month: period.month,
          },
        },
        create: {
          userId,
          month: period.month,
          year: period.year,
          totalIncome,
          totalExpense,
          availableBalance,
          investmentValue,
          goalReserveValue,
          totalPatrimony,
          developmentPoints: score.development,
          hallPoints: score.hall,
          granaryPoints: score.granary,
          harborPoints: score.harbor,
          marketPoints: score.market,
          palisadePoints: score.palisade,
          achievementPoints: score.achievement,
          lighthousePoints: score.lighthouse,
          atmosphere: atmosphere.atmosphere,
          atmosphereReason: atmosphere.reason,
          isClosed: !isCurrent,
          rulesVersion: SETTLEMENT_RULES_VERSION,
        },
        update: {
          totalIncome,
          totalExpense,
          availableBalance,
          investmentValue,
          goalReserveValue,
          totalPatrimony,
          developmentPoints: maximum('development'),
          hallPoints: maximum('hall'),
          granaryPoints: maximum('granary'),
          harborPoints: maximum('harbor'),
          marketPoints: maximum('market'),
          palisadePoints: maximum('palisade'),
          achievementPoints: maximum('achievement'),
          lighthousePoints: maximum('lighthouse'),
          atmosphere: atmosphere.atmosphere,
          atmosphereReason: atmosphere.reason,
          isClosed: !isCurrent,
          rulesVersion: SETTLEMENT_RULES_VERSION,
        },
      });
      computed.push(snapshot);
      incomes.push(totalIncome);
    }

    return computed;
  }

  private async reconcileJourneys(
    userId: string,
    period: Period,
    current: {
      totalIncome: Prisma.Decimal;
      totalExpense: Prisma.Decimal;
      totalPatrimony: Prisma.Decimal;
    },
    previousPatrimony: number,
    medianIncomeValue: number,
    history: FinancialHistory,
    now: Date,
  ) {
    await this.prisma.settlementJourney.updateMany({
      where: {
        userId,
        status: SettlementJourneyStatus.ACTIVE,
        NOT: { year: period.year, month: period.month },
      },
      data: { status: SettlementJourneyStatus.EXPIRED },
    });
    const existing = await this.prisma.settlementJourney.findMany({
      where: { userId, year: period.year, month: period.month },
      orderBy: { slot: 'asc' },
    });
    const incomeBase = Math.max(medianIncomeValue, Number(current.totalIncome), 0);
    const currentPayables = history.payables.filter(
      (item) => item.competenceMonth === period.month && item.competenceYear === period.year,
    );
    const overdueCount = currentPayables.filter(
      (item) => item.status === PayableStatus.PENDING && item.dueDate < now,
    ).length;
    const paidCount = currentPayables.filter((item) => item.status === PayableStatus.PAID).length;
    const activeGoal = history.financialGoals.find(
      (goal) =>
        goal.status === FinancialGoalStatus.ACTIVE &&
        Number(goal.currentAmount) < Number(goal.targetAmount),
    );

    if (!existing.length) {
      const growthTarget = roundedJourneyTarget(incomeBase * 0.03);
      const contributionTarget = roundedJourneyTarget(incomeBase * 0.03);
      const definitions: Prisma.SettlementJourneyCreateManyInput[] = [];
      if (overdueCount > 0) {
        definitions.push({
          userId,
          month: period.month,
          year: period.year,
          slot: 0,
          type: SettlementJourneyType.PAY_BILLS,
          unit: SettlementJourneyUnit.COUNT,
          title: 'Honrar os compromissos',
          description: 'Acalme as águas cuidando das contas que já venceram.',
          baselineValue: paidCount,
          targetValue: paidCount + overdueCount,
          currentValue: paidCount,
          isPrimary: true,
        });
      } else {
        definitions.push({
          userId,
          month: period.month,
          year: period.year,
          slot: 0,
          type: SettlementJourneyType.GROW_PATRIMONY,
          unit: SettlementJourneyUnit.CURRENCY,
          title: 'Maré favorável',
          description: 'Faça seu patrimônio avançar um pouco além do ciclo anterior.',
          baselineValue: previousPatrimony,
          targetValue: previousPatrimony + growthTarget,
          currentValue: Number(current.totalPatrimony),
          isPrimary: true,
        });
      }
      definitions.push({
        userId,
        month: period.month,
        year: period.year,
        slot: 1,
        type: SettlementJourneyType.INVEST,
        unit: SettlementJourneyUnit.CURRENCY,
        title: 'Fortalecer o porto',
        description: 'Realize um aporte para trazer um novo horizonte ao porto.',
        baselineValue: 0,
        targetValue: contributionTarget,
        currentValue: 0,
        isPrimary: false,
      });
      if (activeGoal) {
        const remaining = Number(activeGoal.targetAmount) - Number(activeGoal.currentAmount);
        definitions.push({
          userId,
          month: period.month,
          year: period.year,
          slot: 2,
          type: SettlementJourneyType.CONTRIBUTE_GOAL,
          unit: SettlementJourneyUnit.CURRENCY,
          title: 'Preparar a próxima expedição',
          description: `Aproxime a aldeia da conquista “${activeGoal.name}”.`,
          baselineValue: 0,
          targetValue: Math.min(remaining, contributionTarget),
          currentValue: 0,
          isPrimary: false,
        });
      } else {
        definitions.push({
          userId,
          month: period.month,
          year: period.year,
          slot: 2,
          type: SettlementJourneyType.SAVE_INCOME,
          unit: SettlementJourneyUnit.CURRENCY,
          title: 'Abastecer o celeiro',
          description: 'Preserve uma parte das receitas para fortalecer o próximo ciclo.',
          baselineValue: 0,
          targetValue: roundedJourneyTarget(incomeBase * 0.05),
          currentValue: 0,
          isPrimary: false,
        });
      }
      await this.prisma.settlementJourney.createMany({
        data: definitions,
        skipDuplicates: true,
      });
    }

    const currentInvestment = this.sum(
      history.investmentContributions
        .filter((item) => item.month === period.month && item.year === period.year)
        .map((item) => item.amount),
    );
    const currentGoalContribution = this.sum(
      history.financialGoals.flatMap((goal) =>
        goal.contributions
          .filter(
            (item) =>
              item.contributedAt.getUTCMonth() + 1 === period.month &&
              item.contributedAt.getUTCFullYear() === period.year,
          )
          .map((item) => item.amount),
      ),
    );
    const journeys = await this.prisma.settlementJourney.findMany({
      where: { userId, year: period.year, month: period.month },
      orderBy: { slot: 'asc' },
    });

    for (const journey of journeys) {
      const currentValue = (() => {
        switch (journey.type) {
          case SettlementJourneyType.GROW_PATRIMONY:
            return Number(current.totalPatrimony);
          case SettlementJourneyType.SAVE_INCOME:
            return Math.max(0, Number(current.totalIncome) - Number(current.totalExpense));
          case SettlementJourneyType.PAY_BILLS:
            return paidCount;
          case SettlementJourneyType.INVEST:
            return currentInvestment;
          case SettlementJourneyType.CONTRIBUTE_GOAL:
            return currentGoalContribution;
        }
      })();
      const completed =
        journey.status === SettlementJourneyStatus.COMPLETED ||
        currentValue >= Number(journey.targetValue);
      await this.prisma.settlementJourney.update({
        where: { id: journey.id },
        data: {
          currentValue: Math.max(Number(journey.currentValue), currentValue),
          status: completed ? SettlementJourneyStatus.COMPLETED : journey.status,
          completedAt: completed ? (journey.completedAt ?? now) : journey.completedAt,
        },
      });
    }

    return this.prisma.settlementJourney.findMany({
      where: { userId, year: period.year, month: period.month },
      orderBy: { slot: 'asc' },
    });
  }

  private toJourneyResponse(
    journey: Awaited<ReturnType<SettlementService['reconcileJourneys']>>[number],
  ) {
    const baseline = Number(journey.baselineValue);
    const target = Number(journey.targetValue);
    const current = Number(journey.currentValue);
    const total = Math.max(target - baseline, 1);
    const progress = Math.min(100, Math.max(0, ((current - baseline) / total) * 100));
    return {
      id: journey.id,
      type: journey.type,
      unit: journey.unit,
      title: journey.title,
      description: journey.description,
      baselineValue: new Prisma.Decimal(journey.baselineValue).toFixed(2),
      targetValue: new Prisma.Decimal(journey.targetValue).toFixed(2),
      currentValue: new Prisma.Decimal(journey.currentValue).toFixed(2),
      progressPercentage: Number(progress.toFixed(2)),
      isPrimary: journey.isPrimary,
      status: journey.status,
      completedAt: journey.completedAt?.toISOString() ?? null,
    };
  }

  private fenrirMessage(
    atmosphere: string,
    journeys: Awaited<ReturnType<SettlementService['reconcileJourneys']>>,
  ): string {
    if (journeys.some((journey) => journey.status === SettlementJourneyStatus.COMPLETED)) {
      return 'Uma jornada foi concluída. Pequenas vitórias também erguem grandes salões.';
    }
    if (atmosphere === 'ATTENTION') {
      return 'Os ventos mudaram, mas nenhuma construção se perde. Ajuste a rota no seu tempo.';
    }
    if (atmosphere === 'FAVORABLE') {
      return 'A aurora acompanha suas escolhas. O assentamento avança com você.';
    }
    return 'Cada ciclo cultivado prepara uma nova colheita para a aldeia.';
  }

  private earliestPeriod(history: FinancialHistory, fallback: Period): Period {
    const dates = [
      ...history.transactions.map((item) => item.occurredAt),
      ...history.investmentContributions.map((item) => item.contributedAt),
      ...history.financialGoals.flatMap((goal) => [
        goal.createdAt,
        ...goal.contributions.map((item) => item.contributedAt),
      ]),
      ...history.payables.map((item) => item.dueDate),
      ...history.recurrences.map((item) => item.startDate),
    ];
    if (!dates.length) return fallback;
    const first = dates.reduce((earliest, date) => (date < earliest ? date : earliest));
    const period = { month: first.getUTCMonth() + 1, year: first.getUTCFullYear() };
    return this.periodKey(period) > this.periodKey(fallback) ? fallback : period;
  }

  private periodsFrom(start: Period, end: Period): Period[] {
    const result: Period[] = [];
    let current = { ...start };
    while (this.periodKey(current) <= this.periodKey(end)) {
      result.push({ ...current });
      current =
        current.month === 12
          ? { month: 1, year: current.year + 1 }
          : { month: current.month + 1, year: current.year };
    }
    return result;
  }

  private investmentValueAt(history: FinancialHistory, date: Date): number {
    return history.investmentContributions
      .filter((item) => item.contributedAt <= date)
      .reduce((total, contribution) => {
        const months = this.fullMonthsBetween(contribution.contributedAt, date);
        const annualRate = Number(contribution.selicAnnualRatePercent ?? 0) / 100;
        const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
        return total + Number(contribution.amount) * Math.pow(1 + monthlyRate, months);
      }, 0);
  }

  private goalReserveAt(history: FinancialHistory, periodEnd: Date): number {
    return history.financialGoals.reduce((total, goal) => {
      if (goal.createdAt >= periodEnd) return total;
      const allContributions = this.sum(goal.contributions.map((item) => item.amount));
      const openingValue = Math.max(0, Number(goal.currentAmount) - allContributions);
      const contributionsAtDate = this.sum(
        goal.contributions
          .filter((item) => item.contributedAt < periodEnd)
          .map((item) => item.amount),
      );
      return total + openingValue + contributionsAtDate;
    }, 0);
  }

  private emergencyReserveAt(history: FinancialHistory, periodEnd: Date): number {
    return history.financialGoals
      .filter((goal) => goal.category === FinancialGoalCategory.EMERGENCY_RESERVE)
      .reduce((total, goal) => {
        if (goal.createdAt >= periodEnd) return total;
        const allContributions = this.sum(goal.contributions.map((item) => item.amount));
        const openingValue = Math.max(0, Number(goal.currentAmount) - allContributions);
        const contributionsAtDate = this.sum(
          goal.contributions
            .filter((item) => item.contributedAt < periodEnd)
            .map((item) => item.amount),
        );
        return total + openingValue + contributionsAtDate;
      }, 0);
  }

  private fullMonthsBetween(start: Date, end: Date): number {
    const monthDifference =
      (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
      end.getUTCMonth() -
      start.getUTCMonth();
    return Math.max(0, monthDifference - (end.getUTCDate() < start.getUTCDate() ? 1 : 0));
  }

  private periodStart(period: Period): Date {
    return new Date(Date.UTC(period.year, period.month - 1, 1));
  }

  private periodEnd(period: Period): Date {
    return new Date(Date.UTC(period.year, period.month, 1));
  }

  private periodKey(period: Period): string {
    return `${period.year}-${String(period.month).padStart(2, '0')}`;
  }

  private endOfDay(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999),
    );
  }

  private sum(values: Array<Prisma.Decimal | number>): number {
    return values.reduce<number>((total, value) => total + Number(value), 0);
  }

  private snapshotField(
    scoreField:
      | 'development'
      | 'hall'
      | 'granary'
      | 'harbor'
      | 'market'
      | 'palisade'
      | 'achievement'
      | 'lighthouse',
  ):
    | 'developmentPoints'
    | 'hallPoints'
    | 'granaryPoints'
    | 'harborPoints'
    | 'marketPoints'
    | 'palisadePoints'
    | 'achievementPoints'
    | 'lighthousePoints' {
    return `${scoreField}Points` as ReturnType<SettlementService['snapshotField']>;
  }
}
