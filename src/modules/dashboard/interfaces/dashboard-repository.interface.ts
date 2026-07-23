import {
  DashboardCategorySpendingEntity,
  DashboardGoalEntity,
  DashboardPeriod,
  DashboardRecurrenceTotalsEntity,
  DashboardTransactionTotalsEntity,
} from '../entities/dashboard-summary.entity';

export const DASHBOARD_REPOSITORY = Symbol('DASHBOARD_REPOSITORY');

export interface DashboardRepository {
  getTransactionTotals(period: DashboardPeriod): Promise<DashboardTransactionTotalsEntity>;
  getPendingRecurrenceTotals(period: DashboardPeriod): Promise<DashboardRecurrenceTotalsEntity>;
  getInvestmentContributionTotal(period: DashboardPeriod): Promise<string>;
  getSpendingByCategory(period: DashboardPeriod): Promise<DashboardCategorySpendingEntity[]>;
  getGoalsByPeriod(period: DashboardPeriod): Promise<DashboardGoalEntity[]>;
}
