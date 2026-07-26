import { FinancialGoalCategory, FinancialGoalStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { FinancialGoalsService } from './financial-goals.service';

describe('FinancialGoalsService', () => {
  const now = new Date('2026-07-26T12:00:00.000Z');
  const prisma = {
    financialGoal: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  const service = new FinancialGoalsService(prisma as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('marks a goal as completed when the accumulated amount reaches the target', async () => {
    prisma.financialGoal.create.mockImplementation(({ data }) => ({
      id: 'goal-id',
      ...data,
      icon: null,
      targetDate: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }));

    const result = await service.create('user-id', {
      name: 'Reserva',
      targetAmount: '1000.00',
      currentAmount: '1000.00',
    });

    expect(result.status).toBe(FinancialGoalStatus.COMPLETED);
    expect(result.category).toBe(FinancialGoalCategory.OTHER);
    expect(result.progressPercentage).toBe(100);
    expect(result.remainingAmount).toBe('0.00');
  });

  it('calculates real progress without exceeding one hundred percent', async () => {
    prisma.financialGoal.findMany.mockResolvedValue([
      {
        id: 'goal-id',
        userId: 'user-id',
        name: 'Viagem',
        targetAmount: new Prisma.Decimal('2000'),
        currentAmount: new Prisma.Decimal('500'),
        targetDate: now,
        icon: null,
        category: FinancialGoalCategory.TRAVEL,
        status: FinancialGoalStatus.ACTIVE,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    ]);

    const [result] = await service.list('user-id');

    expect(result.progressPercentage).toBe(25);
    expect(result.remainingAmount).toBe('1500.00');
    expect(result.category).toBe(FinancialGoalCategory.TRAVEL);
  });
});
