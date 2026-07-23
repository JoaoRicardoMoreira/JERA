import { RecurrenceFrequency, TransactionType as PrismaTransactionType } from '@prisma/client';

import { PrismaService } from '../../../src/database/prisma.service';
import { TransactionType } from '../../../src/modules/transactions/entities/transaction-type.enum';
import { RecurrencesRepository } from '../../../src/modules/recurrences/recurrences.repository';
import {
  cleanupDatabase,
  createPrismaService,
  createTestCategory,
  createTestRecurrence,
  createTestUser,
  describeWithTestDatabase,
} from '../helpers/database';

describeWithTestDatabase('RecurrencesRepository integration', () => {
  let prisma: PrismaService;
  let repository: RecurrencesRepository;

  beforeAll(async () => {
    prisma = await createPrismaService();
    repository = new RecurrencesRepository(prisma);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('finds only active, not deleted recurrences for the requested user', async () => {
    const user = await createTestUser(prisma, 'recurrences-owner');
    const otherUser = await createTestUser(prisma, 'recurrences-other');
    const active = await createTestRecurrence(prisma, { userId: user.id });
    await createTestRecurrence(prisma, { userId: otherUser.id });
    await createTestRecurrence(prisma, { userId: user.id, deletedAt: new Date() });

    const recurrences = await repository.findActiveByUserId(user.id);

    expect(recurrences).toHaveLength(1);
    expect(recurrences[0].id).toBe(active.id);
  });

  it('processes due recurrences atomically and skips repeated processing in the same period', async () => {
    const user = await createTestUser(prisma, 'recurrences-process');
    const category = await createTestCategory(prisma, user.id, PrismaTransactionType.EXPENSE);
    const recurrence = await repository.create({
      userId: user.id,
      categoryId: category.id,
      amount: '75.00',
      type: TransactionType.EXPENSE,
      frequency: RecurrenceFrequency.MONTHLY,
      description: 'Subscription',
      startDate: new Date(Date.UTC(2026, 0, 1)),
    });
    const payload = {
      userId: user.id,
      periodStart: new Date(Date.UTC(2026, 6, 1)),
      periodEnd: new Date(Date.UTC(2026, 7, 1)),
      processedAt: new Date(Date.UTC(2026, 6, 3)),
      recurrences: [
        {
          id: recurrence.id,
          categoryId: category.id,
          amount: '75.00',
          type: TransactionType.EXPENSE,
          description: 'Subscription',
          occurredAt: new Date(Date.UTC(2026, 6, 3)),
        },
      ],
    };

    await expect(repository.processDueRecurrences(payload)).resolves.toMatchObject({
      processedCount: 1,
      skippedCount: 0,
    });
    await expect(repository.processDueRecurrences(payload)).resolves.toMatchObject({
      processedCount: 0,
      skippedCount: 1,
    });

    const transactionCount = await prisma.transaction.count({
      where: { userId: user.id, categoryId: category.id, deletedAt: null },
    });

    expect(transactionCount).toBe(1);
  });
});
