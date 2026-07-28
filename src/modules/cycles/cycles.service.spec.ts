import { PrismaService } from '../../database/prisma.service';
import { CyclesService } from './cycles.service';

describe('CyclesService', () => {
  const periodMonth = (args: {
    where?: { occurredAt?: { gte?: Date }; contributedAt?: { gte?: Date } };
  }) => (args.where?.occurredAt?.gte ?? args.where?.contributedAt?.gte)?.getUTCMonth() === 6;

  function createService() {
    const prisma = {
      transaction: {
        findMany: jest.fn(async (args) =>
          periodMonth(args)
            ? [
                {
                  id: 'expense',
                  type: 'EXPENSE',
                  amount: '200',
                  description: 'Mercado',
                  occurredAt: new Date('2026-07-10T12:00:00.000Z'),
                  categoryId: null,
                  category: null,
                  payable: null,
                },
              ]
            : [],
        ),
        groupBy: jest.fn().mockResolvedValue([]),
      },
      recurrence: {
        findMany: jest.fn(async (args) =>
          args.where.startDate.lt.getUTCMonth() === 7
            ? [
                {
                  id: 'salary',
                  type: 'INCOME',
                  amount: '1000',
                  description: 'Salário',
                  frequency: 'MONTHLY',
                  status: 'ACTIVE',
                  startDate: new Date('2026-01-05T12:00:00.000Z'),
                  endDate: null,
                  lastProcessedAt: null,
                  categoryId: null,
                  category: null,
                },
              ]
            : [],
        ),
      },
      payable: { findMany: jest.fn().mockResolvedValue([]) },
      investmentContribution: {
        findMany: jest.fn(async (args) =>
          periodMonth(args)
            ? [
                {
                  id: 'investment',
                  amount: '100',
                  contributedAt: new Date('2026-07-15T12:00:00.000Z'),
                },
              ]
            : [],
        ),
      },
      financialGoalContribution: { findMany: jest.fn().mockResolvedValue([]) },
      financialCycleReview: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({}),
      },
      goal: { findMany: jest.fn().mockResolvedValue([]) },
      financialGoal: { count: jest.fn().mockResolvedValue(0) },
      settlementJourney: { count: jest.fn().mockResolvedValue(0) },
    };
    return {
      service: new CyclesService(prisma as unknown as PrismaService),
      prisma,
    };
  }

  afterEach(() => {
    jest.useRealTimers();
  });

  it('derives planned and realized values from dates without manual status', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-04T12:00:00.000Z'));
    const { service } = createService();

    const result = await service.getOverview('user-id', { month: 7, year: 2026 });

    expect(result.map.availableBalance).toBe('0.00');
    expect(result.map.projectedBalance).toBe('700.00');
    expect(result.map.events.map((event) => event.status)).toEqual([
      'PLANNED',
      'PLANNED',
      'PLANNED',
    ]);
    expect(result.closing.available).toBe(false);
  });

  it('makes the ritual available near the end of the current cycle', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-27T12:00:00.000Z'));
    const { service, prisma } = createService();

    const result = await service.reviewCycle('user-id', { month: 7, year: 2026 });

    expect(prisma.financialCycleReview.upsert).toHaveBeenCalled();
    expect(result.closing.available).toBe(true);
    expect(result.map.availableBalance).toBe('700.00');
  });
});
