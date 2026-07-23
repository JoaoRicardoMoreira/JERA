import {
  DashboardCategorySpendingEntity,
  DashboardGoalEntity,
  DashboardPeriod,
  DashboardTransactionTotalsEntity,
} from '../entities/dashboard-summary.entity';
import { DashboardMapper } from '../mapper/dashboard.mapper';

describe('DashboardMapper', () => {
  const period: DashboardPeriod = {
    userId: 'user-id',
    month: 7,
    year: 2026,
  };

  it('maps monthly summary totals and goal progress', () => {
    expect(
      DashboardMapper.toMonthlySummary(
        period,
        new DashboardTransactionTotalsEntity('1000.00', '350.50', 3),
        [
          {
            categoryId: 'food-id',
            categoryName: 'Food',
            goalAmount: '500.00',
            spentAmount: '350.50',
            remainingAmount: '149.50',
            progressPercentage: 70.1,
            isExceeded: false,
          },
        ],
      ),
    ).toEqual({
      month: 7,
      year: 2026,
      totalIncome: '1000.00',
      totalExpense: '350.50',
      totalInvestment: '0.00',
      balance: '649.50',
      transactionCount: 3,
      goals: {
        totalGoalAmount: '500.00',
        totalGoalSpentAmount: '350.50',
        totalGoalRemainingAmount: '149.50',
        progressPercentage: 70.1,
        hasExceededGoals: false,
      },
    });
  });

  it('maps chart data with category percentages and goal exceedance', () => {
    expect(
      DashboardMapper.toCharts(
        period,
        [
          new DashboardCategorySpendingEntity('food-id', 'Food', '75.00'),
          new DashboardCategorySpendingEntity('transport-id', 'Transport', '25.00'),
        ],
        [
          new DashboardGoalEntity('goal-id', 'food-id', 'Food', '50.00'),
          new DashboardGoalEntity('goal-id-2', 'transport-id', 'Transport', '50.00'),
        ],
      ),
    ).toEqual({
      month: 7,
      year: 2026,
      spendingByCategory: [
        {
          categoryId: 'food-id',
          categoryName: 'Food',
          amount: '75.00',
          percentage: 75,
        },
        {
          categoryId: 'transport-id',
          categoryName: 'Transport',
          amount: '25.00',
          percentage: 25,
        },
      ],
      goalsByCategory: [
        {
          categoryId: 'food-id',
          categoryName: 'Food',
          goalAmount: '50.00',
          spentAmount: '75.00',
          remainingAmount: '0.00',
          progressPercentage: 150,
          isExceeded: true,
        },
        {
          categoryId: 'transport-id',
          categoryName: 'Transport',
          goalAmount: '50.00',
          spentAmount: '25.00',
          remainingAmount: '25.00',
          progressPercentage: 50,
          isExceeded: false,
        },
      ],
    });
  });
});
