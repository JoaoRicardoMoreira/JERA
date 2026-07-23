import { Test, TestingModule } from '@nestjs/testing';
import { TransactionType } from '@prisma/client';

import { GoalEntity } from '../entities/goal.entity';
import { GOALS_REPOSITORY, GoalRepository } from '../interfaces/goal-repository.interface';
import { GoalsService } from '../goals.service';
import { GoalValidator } from '../validators/goal.validator';

describe('GoalsService', () => {
  let service: GoalsService;
  let repository: jest.Mocked<GoalRepository>;

  const userId = '2e3c3c78-26dc-4a97-8c6c-cc3b8f4e8f4c';
  const categoryId = '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67';
  const goal = new GoalEntity(
    '7f923c74-4c4b-4798-a5cf-d4098d561d70',
    userId,
    categoryId,
    'Alimentacao',
    '1200.00',
    7,
    2026,
    new Date('2026-07-03T12:00:00.000Z'),
    new Date('2026-07-03T12:01:00.000Z'),
    null,
  );

  beforeEach(async () => {
    repository = {
      upsert: jest.fn(),
      findByPeriod: jest.fn(),
      findCategoryForUser: jest.fn(),
      sumExpensesByCategoryForPeriod: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        GoalValidator,
        {
          provide: GOALS_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get(GoalsService);
  });

  it('should create or update a goal for an expense category', async () => {
    repository.findCategoryForUser.mockResolvedValue({
      id: categoryId,
      type: TransactionType.EXPENSE,
    });
    repository.upsert.mockResolvedValue(goal);
    repository.sumExpensesByCategoryForPeriod.mockResolvedValue(new Map([[categoryId, '780.25']]));

    const response = await service.upsertGoal(userId, {
      categoryId,
      amount: '1200.00',
      month: 7,
      year: 2026,
    });

    expect(repository.findCategoryForUser).toHaveBeenCalledWith(userId, categoryId);
    expect(repository.upsert).toHaveBeenCalledWith({
      userId,
      categoryId,
      amount: '1200.00',
      month: 7,
      year: 2026,
    });
    expect(response).toEqual({
      id: goal.id,
      categoryId,
      categoryName: 'Alimentacao',
      amount: '1200.00',
      spentAmount: '780.25',
      remainingAmount: '419.75',
      progressPercentage: 65.02,
      isExceeded: false,
      month: 7,
      year: 2026,
      createdAt: '2026-07-03T12:00:00.000Z',
      updatedAt: '2026-07-03T12:01:00.000Z',
    });
  });

  it('should list goals with progress by category for a period', async () => {
    repository.findByPeriod.mockResolvedValue([goal]);
    repository.sumExpensesByCategoryForPeriod.mockResolvedValue(new Map([[categoryId, '1300.00']]));

    const response = await service.getGoalsByPeriod(userId, {
      month: 7,
      year: 2026,
    });

    expect(repository.findByPeriod).toHaveBeenCalledWith({
      userId,
      month: 7,
      year: 2026,
    });
    expect(response).toEqual([
      expect.objectContaining({
        categoryId,
        spentAmount: '1300.00',
        remainingAmount: '0.00',
        progressPercentage: 108.33,
        isExceeded: true,
      }),
    ]);
  });

  it('should reject goals for income categories', async () => {
    repository.findCategoryForUser.mockResolvedValue({
      id: categoryId,
      type: TransactionType.INCOME,
    });

    await expect(
      service.upsertGoal(userId, {
        categoryId,
        amount: '1200.00',
        month: 7,
        year: 2026,
      }),
    ).rejects.toMatchObject({
      response: {
        code: 'GOAL_CATEGORY_TYPE_MISMATCH',
      },
    });
    expect(repository.upsert).not.toHaveBeenCalled();
  });
});
