import { Test, TestingModule } from '@nestjs/testing';

import {
  DashboardCategorySpendingEntity,
  DashboardGoalEntity,
  DashboardRecurrenceTotalsEntity,
  DashboardTransactionTotalsEntity,
} from '../entities/dashboard-summary.entity';
import {
  DASHBOARD_REPOSITORY,
  DashboardRepository,
} from '../interfaces/dashboard-repository.interface';
import { DashboardServiceImpl } from '../dashboard.service';

describe('DashboardService', () => {
  let service: DashboardServiceImpl;
  let repository: jest.Mocked<DashboardRepository>;

  const userId = '2e3c3c78-26dc-4a97-8c6c-cc3b8f4e8f4c';
  const query = { month: 7, year: 2026 };
  const categoryId = '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67';

  beforeEach(async () => {
    repository = {
      getTransactionTotals: jest.fn(),
      getPendingRecurrenceTotals: jest.fn(),
      getInvestmentContributionTotal: jest.fn(),
      getSpendingByCategory: jest.fn(),
      getGoalsByPeriod: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardServiceImpl,
        {
          provide: DASHBOARD_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get(DashboardServiceImpl);
    repository.getPendingRecurrenceTotals.mockResolvedValue(
      new DashboardRecurrenceTotalsEntity('0.00', '0.00', 0),
    );
    repository.getInvestmentContributionTotal.mockResolvedValue('0.00');
  });

  it('includes unprocessed recurrences in the monthly projected balance', async () => {
    repository.getTransactionTotals.mockResolvedValue(
      new DashboardTransactionTotalsEntity('1000.00', '200.00', 2),
    );
    repository.getPendingRecurrenceTotals.mockResolvedValue(
      new DashboardRecurrenceTotalsEntity('5000.00', '800.00', 2),
    );
    repository.getSpendingByCategory.mockResolvedValue([]);
    repository.getGoalsByPeriod.mockResolvedValue([]);

    const response = await service.getMonthlySummary(userId, query);

    expect(response.totalIncome).toBe('6000.00');
    expect(response.totalExpense).toBe('1000.00');
    expect(response.balance).toBe('5000.00');
    expect(response.transactionCount).toBe(4);
  });

  it('should return monthly summary with balance and goal aggregation', async () => {
    repository.getTransactionTotals.mockResolvedValue(
      new DashboardTransactionTotalsEntity('7000.00', '4500.00', 8),
    );
    repository.getSpendingByCategory.mockResolvedValue([
      new DashboardCategorySpendingEntity(categoryId, 'Alimentacao', '780.25'),
    ]);
    repository.getGoalsByPeriod.mockResolvedValue([
      new DashboardGoalEntity(
        '7f923c74-4c4b-4798-a5cf-d4098d561d70',
        categoryId,
        'Alimentacao',
        '1200.00',
      ),
    ]);

    const response = await service.getMonthlySummary(userId, query);

    expect(repository.getTransactionTotals).toHaveBeenCalledWith({ userId, ...query });
    expect(repository.getSpendingByCategory).toHaveBeenCalledWith({ userId, ...query });
    expect(repository.getGoalsByPeriod).toHaveBeenCalledWith({ userId, ...query });
    expect(response).toEqual({
      month: 7,
      year: 2026,
      totalIncome: '7000.00',
      totalExpense: '4500.00',
      totalInvestment: '0.00',
      balance: '2500.00',
      transactionCount: 8,
      goals: {
        totalGoalAmount: '1200.00',
        totalGoalSpentAmount: '780.25',
        totalGoalRemainingAmount: '419.75',
        progressPercentage: 65.02,
        hasExceededGoals: false,
      },
    });
  });

  it('debits investment contributions from the available balance', async () => {
    repository.getTransactionTotals.mockResolvedValue(
      new DashboardTransactionTotalsEntity('5000.00', '2000.00', 2),
    );
    repository.getPendingRecurrenceTotals.mockResolvedValue(
      new DashboardRecurrenceTotalsEntity('0.00', '0.00', 0),
    );
    repository.getInvestmentContributionTotal.mockResolvedValue('2000.00');
    repository.getSpendingByCategory.mockResolvedValue([]);
    repository.getGoalsByPeriod.mockResolvedValue([]);

    const response = await service.getMonthlySummary(userId, query);

    expect(response.totalInvestment).toBe('2000.00');
    expect(response.balance).toBe('1000.00');
  });

  it('should return chart payload with spending percentages and goal progress', async () => {
    repository.getSpendingByCategory.mockResolvedValue([
      new DashboardCategorySpendingEntity(categoryId, 'Alimentacao', '780.25'),
      new DashboardCategorySpendingEntity(null, 'Sem categoria', '219.75'),
    ]);
    repository.getGoalsByPeriod.mockResolvedValue([
      new DashboardGoalEntity(
        '7f923c74-4c4b-4798-a5cf-d4098d561d70',
        categoryId,
        'Alimentacao',
        '1200.00',
      ),
    ]);

    const response = await service.getCharts(userId, query);

    expect(response).toEqual({
      month: 7,
      year: 2026,
      spendingByCategory: [
        {
          categoryId,
          categoryName: 'Alimentacao',
          amount: '780.25',
          percentage: 78.03,
        },
        {
          categoryId: null,
          categoryName: 'Sem categoria',
          amount: '219.75',
          percentage: 21.98,
        },
      ],
      goalsByCategory: [
        {
          categoryId,
          categoryName: 'Alimentacao',
          goalAmount: '1200.00',
          spentAmount: '780.25',
          remainingAmount: '419.75',
          progressPercentage: 65.02,
          isExceeded: false,
        },
      ],
    });
  });
});
