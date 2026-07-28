import { BadRequestException, Injectable } from '@nestjs/common';
import {
  FinancialGoalStatus,
  PayableStatus,
  Prisma,
  RecurrenceFrequency,
  RecurrenceStatus,
  SettlementJourneyStatus,
  TransactionType,
} from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import {
  CycleClosingDto,
  CycleEventDto,
  CycleEventStatus,
  CycleEventType,
  CycleMapDto,
  CycleOverviewDto,
  CyclePointDto,
  CycleQueryDto,
} from './dto/cycle.dto';

type Period = { month: number; year: number };
type InternalEvent = {
  id: string;
  type: CycleEventType;
  date: Date;
  title: string;
  categoryId: string | null;
  categoryName: string | null;
  amount: number;
  pendingPayable?: boolean;
};

@Injectable()
export class CyclesService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string, query: CycleQueryDto): Promise<CycleOverviewDto> {
    const period = { month: query.month, year: query.year };
    const previous = this.previousPeriod(period);
    const [currentMap, previousMap] = await Promise.all([
      this.buildMap(userId, period),
      this.buildMap(userId, previous),
    ]);
    const closing = await this.buildClosing(userId, period, currentMap, previousMap);
    return { map: currentMap, closing };
  }

  async reviewCycle(userId: string, query: CycleQueryDto): Promise<CycleOverviewDto> {
    const period = { month: query.month, year: query.year };
    if (!this.isClosingAvailable(period, new Date())) {
      throw new BadRequestException(
        'O ritual fica disponível nos últimos dias do ciclo ou em períodos anteriores.',
      );
    }
    await this.prisma.financialCycleReview.upsert({
      where: { userId_year_month: { userId, year: period.year, month: period.month } },
      create: { userId, year: period.year, month: period.month },
      update: { reviewedAt: new Date() },
    });
    return this.getOverview(userId, query);
  }

  private async buildMap(userId: string, period: Period): Promise<CycleMapDto> {
    const start = this.periodStart(period);
    const end = this.periodEnd(period);
    const asOf = this.asOfDate(period, new Date());
    const [transactions, recurrences, payables, investments, goalContributions] = await Promise.all(
      [
        this.prisma.transaction.findMany({
          where: { userId, deletedAt: null, occurredAt: { gte: start, lt: end } },
          include: {
            category: { select: { name: true } },
            payable: { select: { id: true } },
          },
        }),
        this.prisma.recurrence.findMany({
          where: {
            userId,
            status: RecurrenceStatus.ACTIVE,
            deletedAt: null,
            startDate: { lt: end },
            OR: [{ endDate: null }, { endDate: { gte: start } }],
          },
          include: { category: { select: { name: true } } },
        }),
        this.prisma.payable.findMany({
          where: {
            userId,
            competenceMonth: period.month,
            competenceYear: period.year,
            deletedAt: null,
            status: { not: PayableStatus.CANCELLED },
          },
          include: { category: { select: { name: true } } },
        }),
        this.prisma.investmentContribution.findMany({
          where: { userId, deletedAt: null, contributedAt: { gte: start, lt: end } },
        }),
        this.prisma.financialGoalContribution.findMany({
          where: { userId, deletedAt: null, contributedAt: { gte: start, lt: end } },
          include: { financialGoal: { select: { name: true } } },
        }),
      ],
    );

    const events: InternalEvent[] = transactions.map((item) => ({
      id: `transaction:${item.id}`,
      type: item.type === TransactionType.INCOME ? 'INCOME' : 'EXPENSE',
      date: item.occurredAt,
      title:
        item.description?.trim() || (item.type === TransactionType.INCOME ? 'Receita' : 'Despesa'),
      categoryId: item.categoryId,
      categoryName: item.category?.name ?? null,
      amount: Number(item.amount),
    }));
    const linkedPayableIds = new Set(
      transactions.map((item) => item.payable?.id).filter((id): id is string => Boolean(id)),
    );
    payables
      .filter((item) => !linkedPayableIds.has(item.id))
      .forEach((item) =>
        events.push({
          id: `payable:${item.id}`,
          type: 'EXPENSE',
          date: item.dueDate,
          title: item.description,
          categoryId: item.categoryId,
          categoryName: item.category?.name ?? null,
          amount: Number(item.amount),
          pendingPayable: item.status === PayableStatus.PENDING,
        }),
      );

    const payableRecurrenceIds = new Set(
      payables.map((item) => item.recurrenceId).filter((id): id is string => Boolean(id)),
    );
    recurrences.forEach((recurrence) => {
      const processedInPeriod =
        recurrence.lastProcessedAt &&
        recurrence.lastProcessedAt >= start &&
        recurrence.lastProcessedAt < end;
      if (
        (recurrence.type === TransactionType.INCOME && processedInPeriod) ||
        (recurrence.type === TransactionType.EXPENSE && payableRecurrenceIds.has(recurrence.id))
      ) {
        return;
      }
      this.occurrenceDates(recurrence, period).forEach((date, index) =>
        events.push({
          id: `recurrence:${recurrence.id}:${index}`,
          type: recurrence.type === TransactionType.INCOME ? 'INCOME' : 'EXPENSE',
          date,
          title:
            recurrence.description?.trim() ||
            (recurrence.type === TransactionType.INCOME
              ? 'Receita recorrente'
              : 'Despesa recorrente'),
          categoryId: recurrence.categoryId,
          categoryName: recurrence.category?.name ?? null,
          amount: Number(recurrence.amount),
        }),
      );
    });
    investments.forEach((item) =>
      events.push({
        id: `investment:${item.id}`,
        type: 'INVESTMENT',
        date: item.contributedAt,
        title: 'Aporte de investimento',
        categoryId: null,
        categoryName: 'Investimentos',
        amount: Number(item.amount),
      }),
    );
    goalContributions.forEach((item) =>
      events.push({
        id: `goal:${item.id}`,
        type: 'GOAL',
        date: item.contributedAt,
        title: `Aporte em ${item.financialGoal.name}`,
        categoryId: null,
        categoryName: 'Metas',
        amount: Number(item.amount),
      }),
    );

    events.sort((a, b) => a.date.getTime() - b.date.getTime() || a.id.localeCompare(b.id));
    return this.toMap(period, asOf, events);
  }

  private toMap(period: Period, asOf: Date, events: InternalEvent[]): CycleMapDto {
    const days = new Date(Date.UTC(period.year, period.month, 0)).getUTCDate();
    let projectedBalance = 0;
    let realizedBalance = 0;
    let projectedIncome = 0;
    let projectedExpense = 0;
    let totalInvestment = 0;
    let totalGoalContribution = 0;
    let lowestBalance = 0;
    let lowestDate = this.periodStart(period);
    const points: CyclePointDto[] = [];
    const outputEvents: CycleEventDto[] = [];

    for (let day = 1; day <= days; day += 1) {
      const date = new Date(Date.UTC(period.year, period.month - 1, day, 12));
      const dayEvents = events.filter((event) => event.date.getUTCDate() === day);
      let dailyIncome = 0;
      let dailyExpense = 0;
      for (const event of dayEvents) {
        const signed = this.signedAmount(event);
        projectedBalance += signed;
        if (event.type === 'INCOME') {
          projectedIncome += event.amount;
          dailyIncome += event.amount;
        } else if (event.type === 'EXPENSE') {
          projectedExpense += event.amount;
          dailyExpense += event.amount;
        } else if (event.type === 'INVESTMENT') {
          totalInvestment += event.amount;
        } else {
          totalGoalContribution += event.amount;
        }
        if (event.date <= asOf) realizedBalance += signed;
        const status = this.eventStatus(event, asOf);
        outputEvents.push({
          id: event.id,
          type: event.type,
          status,
          date: event.date.toISOString(),
          day,
          title: event.title,
          categoryName: event.categoryName,
          amount: this.decimal(event.amount),
          balanceAfter: this.decimal(projectedBalance),
        });
      }
      if (projectedBalance < lowestBalance) {
        lowestBalance = projectedBalance;
        lowestDate = date;
      }
      points.push({
        day,
        date: date.toISOString(),
        projectedBalance: this.decimal(projectedBalance),
        realizedBalance: date <= asOf ? this.decimal(realizedBalance) : null,
        income: this.decimal(dailyIncome),
        expense: this.decimal(dailyExpense),
      });
    }
    const lastRealized = [...points].reverse().find((point) => point.realizedBalance !== null);
    return {
      month: period.month,
      year: period.year,
      asOfDate: asOf.toISOString(),
      availableBalance: lastRealized?.realizedBalance ?? '0.00',
      projectedBalance: this.decimal(projectedBalance),
      projectedIncome: this.decimal(projectedIncome),
      projectedExpense: this.decimal(projectedExpense),
      totalInvestment: this.decimal(totalInvestment),
      totalGoalContribution: this.decimal(totalGoalContribution),
      lowestBalance: this.decimal(lowestBalance),
      lowestBalanceDate: lowestDate.toISOString(),
      daysAtRisk: points.filter((point) => Number(point.projectedBalance) < 0).length,
      events: outputEvents,
      points,
    };
  }

  private async buildClosing(
    userId: string,
    period: Period,
    map: CycleMapDto,
    previousMap: CycleMapDto,
  ): Promise<CycleClosingDto> {
    const start = this.periodStart(period);
    const end = this.periodEnd(period);
    const [review, budgets, expenseTransactions, completedGoals, completedJourneys] =
      await Promise.all([
        this.prisma.financialCycleReview.findUnique({
          where: { userId_year_month: { userId, year: period.year, month: period.month } },
        }),
        this.prisma.goal.findMany({
          where: { userId, month: period.month, year: period.year, deletedAt: null },
        }),
        this.prisma.transaction.groupBy({
          by: ['categoryId'],
          where: {
            userId,
            type: TransactionType.EXPENSE,
            deletedAt: null,
            occurredAt: { gte: start, lt: end },
          },
          _sum: { amount: true },
        }),
        this.prisma.financialGoal.count({
          where: {
            userId,
            status: FinancialGoalStatus.COMPLETED,
            deletedAt: null,
            updatedAt: { gte: start, lt: end },
          },
        }),
        this.prisma.settlementJourney.count({
          where: {
            userId,
            month: period.month,
            year: period.year,
            status: SettlementJourneyStatus.COMPLETED,
          },
        }),
      ]);
    const spentByCategory = new Map(
      expenseTransactions.map((item) => [item.categoryId, Number(item._sum.amount ?? 0)]),
    );
    const respectedBudgetCount = budgets.filter(
      (budget) => (spentByCategory.get(budget.categoryId) ?? 0) <= Number(budget.amount),
    ).length;
    const realizedEvents = map.events.filter((event) => event.status !== 'PLANNED');
    const realizedIncome = this.sumEvents(realizedEvents, 'INCOME');
    const realizedExpense = this.sumEvents(realizedEvents, 'EXPENSE');
    const investedAmount = this.sumEvents(realizedEvents, 'INVESTMENT');
    const goalContributionAmount = this.sumEvents(realizedEvents, 'GOAL');
    const previousEndingBalance = Number(previousMap.projectedBalance);
    const endingBalance = Number(map.availableBalance);
    const achievements = this.achievements({
      realizedIncome,
      previousIncome: Number(previousMap.projectedIncome),
      endingBalance,
      investedAmount,
      goalContributionAmount,
      budgetCount: budgets.length,
      respectedBudgetCount,
      completedGoals,
      completedJourneys,
    });
    return {
      available: this.isClosingAvailable(period, new Date()),
      reviewedAt: review?.reviewedAt.toISOString() ?? null,
      realizedIncome: this.decimal(realizedIncome),
      realizedExpense: this.decimal(realizedExpense),
      investedAmount: this.decimal(investedAmount),
      goalContributionAmount: this.decimal(goalContributionAmount),
      endingBalance: this.decimal(endingBalance),
      balanceDelta: this.decimal(endingBalance - previousEndingBalance),
      savingsRate:
        realizedIncome > 0
          ? Number((((realizedIncome - realizedExpense) / realizedIncome) * 100).toFixed(1))
          : 0,
      budgetCount: budgets.length,
      respectedBudgetCount,
      completedGoals,
      completedJourneys,
      achievements,
      message: this.closingMessage(endingBalance, achievements.length),
    };
  }

  private occurrenceDates(
    recurrence: {
      frequency: RecurrenceFrequency;
      startDate: Date;
      endDate: Date | null;
    },
    period: Period,
  ): Date[] {
    const start = this.periodStart(period);
    const end = this.periodEnd(period);
    const lastDay = new Date(Date.UTC(period.year, period.month, 0)).getUTCDate();
    if (recurrence.frequency === RecurrenceFrequency.MONTHLY) {
      return [
        new Date(
          Date.UTC(
            period.year,
            period.month - 1,
            Math.min(recurrence.startDate.getUTCDate(), lastDay),
            12,
          ),
        ),
      ];
    }
    if (recurrence.frequency === RecurrenceFrequency.YEARLY) {
      if (recurrence.startDate.getUTCMonth() !== period.month - 1) return [];
      return [
        new Date(
          Date.UTC(
            period.year,
            period.month - 1,
            Math.min(recurrence.startDate.getUTCDate(), lastDay),
            12,
          ),
        ),
      ];
    }
    const interval = recurrence.frequency === RecurrenceFrequency.DAILY ? 1 : 7;
    const dates: Date[] = [];
    let cursor = new Date(recurrence.startDate);
    while (cursor < start) cursor = new Date(cursor.getTime() + interval * 86_400_000);
    while (cursor < end && (!recurrence.endDate || cursor <= recurrence.endDate)) {
      dates.push(new Date(Date.UTC(period.year, period.month - 1, cursor.getUTCDate(), 12)));
      cursor = new Date(cursor.getTime() + interval * 86_400_000);
    }
    return dates;
  }

  private eventStatus(event: InternalEvent, asOf: Date): CycleEventStatus {
    if (event.date > asOf) return 'PLANNED';
    if (event.pendingPayable && event.date < this.startOfDay(asOf)) return 'OVERDUE';
    return 'REALIZED';
  }

  private achievements(input: {
    realizedIncome: number;
    previousIncome: number;
    endingBalance: number;
    investedAmount: number;
    goalContributionAmount: number;
    budgetCount: number;
    respectedBudgetCount: number;
    completedGoals: number;
    completedJourneys: number;
  }): string[] {
    const result: string[] = [];
    if (input.endingBalance >= 0) result.push('O ciclo permaneceu em águas seguras.');
    if (input.realizedIncome > input.previousIncome)
      result.push('As receitas avançaram em relação ao ciclo anterior.');
    if (input.investedAmount > 0) result.push('O porto foi fortalecido com novos aportes.');
    if (input.goalContributionAmount > 0) result.push('Um destino recebeu novos recursos.');
    if (input.budgetCount > 0 && input.respectedBudgetCount === input.budgetCount)
      result.push('Todos os orçamentos foram respeitados.');
    if (input.completedGoals > 0) result.push('Uma meta foi conquistada neste ciclo.');
    if (input.completedJourneys > 0) result.push('Jornadas do assentamento foram concluídas.');
    return result.length ? result : ['Você manteve sua jornada registrada e pronta para evoluir.'];
  }

  private closingMessage(balance: number, achievements: number): string {
    if (balance < 0)
      return 'As águas pedem atenção, mas este ciclo trouxe clareza para ajustar a próxima rota.';
    if (achievements >= 3)
      return 'Foi um ciclo de boa colheita. Seu assentamento guarda cada pequena conquista.';
    return 'Mais um ciclo foi cultivado. O próximo horizonte começa com o que você aprendeu aqui.';
  }

  private isClosingAvailable(period: Period, now: Date): boolean {
    const current = { month: now.getMonth() + 1, year: now.getFullYear() };
    const key = this.periodKey(period);
    const currentKey = this.periodKey(current);
    return key < currentKey || (key === currentKey && now.getDate() >= 25);
  }

  private asOfDate(period: Period, now: Date): Date {
    const currentKey = this.periodKey({ month: now.getMonth() + 1, year: now.getFullYear() });
    const key = this.periodKey(period);
    if (key < currentKey) return new Date(this.periodEnd(period).getTime() - 1);
    if (key > currentKey) return new Date(this.periodStart(period).getTime() - 1);
    return new Date(Date.UTC(period.year, period.month - 1, now.getDate(), 23, 59, 59, 999));
  }

  private signedAmount(event: InternalEvent): number {
    return event.type === 'INCOME' ? event.amount : -event.amount;
  }

  private sumEvents(events: CycleEventDto[], type: CycleEventType): number {
    return events
      .filter((event) => event.type === type)
      .reduce((sum, event) => sum + Number(event.amount), 0);
  }

  private previousPeriod(period: Period): Period {
    return period.month === 1
      ? { month: 12, year: period.year - 1 }
      : { month: period.month - 1, year: period.year };
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

  private startOfDay(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  private decimal(value: number): string {
    return new Prisma.Decimal(value).toDecimalPlaces(2).toFixed(2);
  }
}
