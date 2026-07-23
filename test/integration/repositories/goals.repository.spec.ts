import { TransactionType } from '@prisma/client';

import { PrismaService } from '../../../src/database/prisma.service';
import { GoalsRepository } from '../../../src/modules/goals/goals.repository';
import {
  cleanupDatabase,
  createPrismaService,
  createTestCategory,
  createTestGoal,
  createTestTransaction,
  createTestUser,
  describeWithTestDatabase,
} from '../helpers/database';

describeWithTestDatabase('GoalsRepository integration', () => {
  let prisma: PrismaService;
  let repository: GoalsRepository;

  beforeAll(async () => {
    prisma = await createPrismaService();
    repository = new GoalsRepository(prisma);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('upserts and finds active goals only for the requested user and period', async () => {
    const user = await createTestUser(prisma, 'goals-owner');
    const otherUser = await createTestUser(prisma, 'goals-other');
    const category = await createTestCategory(prisma, user.id, TransactionType.EXPENSE);
    const otherCategory = await createTestCategory(prisma, otherUser.id, TransactionType.EXPENSE);
    await createTestGoal(prisma, {
      userId: otherUser.id,
      categoryId: otherCategory.id,
      month: 7,
      year: 2026,
    });

    await repository.upsert({
      userId: user.id,
      categoryId: category.id,
      amount: '500.00',
      month: 7,
      year: 2026,
    });
    await repository.upsert({
      userId: user.id,
      categoryId: category.id,
      amount: '650.00',
      month: 7,
      year: 2026,
    });

    const goals = await repository.findByPeriod({ userId: user.id, month: 7, year: 2026 });

    expect(goals).toHaveLength(1);
    expect(goals[0]).toMatchObject({
      userId: user.id,
      categoryId: category.id,
      amount: '650.00',
    });
  });

  it('sums expenses by category excluding soft deleted transactions', async () => {
    const user = await createTestUser(prisma, 'goals-sum');
    const category = await createTestCategory(prisma, user.id, TransactionType.EXPENSE);
    await createTestTransaction(prisma, {
      userId: user.id,
      categoryId: category.id,
      amount: '30.00',
      type: TransactionType.EXPENSE,
    });
    await createTestTransaction(prisma, {
      userId: user.id,
      categoryId: category.id,
      amount: '25.00',
      type: TransactionType.EXPENSE,
      deletedAt: new Date(),
    });

    const totals = await repository.sumExpensesByCategoryForPeriod({
      userId: user.id,
      month: 7,
      year: 2026,
    });

    expect(totals.get(category.id)).toBe('30.00');
  });
});
