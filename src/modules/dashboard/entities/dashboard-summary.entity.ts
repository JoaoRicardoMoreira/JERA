export interface DashboardPeriod {
  userId: string;
  month: number;
  year: number;
}

export class DashboardTransactionTotalsEntity {
  constructor(
    public readonly totalIncome: string,
    public readonly totalExpense: string,
    public readonly transactionCount: number,
  ) {}
}

export class DashboardRecurrenceTotalsEntity {
  constructor(
    public readonly totalIncome: string,
    public readonly totalExpense: string,
    public readonly recurrenceCount: number,
  ) {}
}

export class DashboardCategorySpendingEntity {
  constructor(
    public readonly categoryId: string | null,
    public readonly categoryName: string,
    public readonly amount: string,
  ) {}
}

export class DashboardGoalEntity {
  constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public readonly categoryName: string,
    public readonly amount: string,
  ) {}
}

export class DashboardSummaryEntity {
  constructor(
    public readonly period: DashboardPeriod,
    public readonly totals: DashboardTransactionTotalsEntity,
    public readonly spendingByCategory: DashboardCategorySpendingEntity[],
    public readonly goals: DashboardGoalEntity[],
  ) {}
}
