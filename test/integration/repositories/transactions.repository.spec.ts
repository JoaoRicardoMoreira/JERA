import { TransactionType as PrismaTransactionType } from '@prisma/client';

import { PrismaService } from '../../../src/database/prisma.service';
import { TransactionType } from '../../../src/modules/transactions/entities/transaction-type.enum';
import { TransactionsRepository } from '../../../src/modules/transactions/transactions.repository';
import {
  cleanupDatabase,
  createPrismaService,
  createTestCategory,
  createTestTransaction,
  createTestUser,
  describeWithTestDatabase,
} from '../helpers/database';

describeWithTestDatabase('TransactionsRepository integration', () => {
  let prisma: PrismaService;
  let repository: TransactionsRepository;

  beforeAll(async () => {
    prisma = await createPrismaService();
    repository = new TransactionsRepository(prisma);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('creates and lists history only for the requested user and active records', async () => {
    const user = await createTestUser(prisma, 'transactions-owner');
    const otherUser = await createTestUser(prisma, 'transactions-other');
    const category = await createTestCategory(prisma, user.id, PrismaTransactionType.EXPENSE);
    await createTestTransaction(prisma, {
      userId: otherUser.id,
      type: PrismaTransactionType.EXPENSE,
      occurredAt: new Date(Date.UTC(2026, 6, 12)),
    });
    await createTestTransaction(prisma, {
      userId: user.id,
      categoryId: category.id,
      type: PrismaTransactionType.EXPENSE,
      deletedAt: new Date(),
      occurredAt: new Date(Date.UTC(2026, 6, 11)),
    });

    const created = await repository.create({
      userId: user.id,
      categoryId: category.id,
      amount: '42.50',
      type: TransactionType.EXPENSE,
      description: 'Market',
      occurredAt: new Date(Date.UTC(2026, 6, 10)),
    });
    const history = await repository.findHistory({
      userId: user.id,
      month: 7,
      year: 2026,
      type: TransactionType.EXPENSE,
    });

    expect(created).toMatchObject({
      userId: user.id,
      categoryId: category.id,
      amount: '42.50',
      type: TransactionType.EXPENSE,
    });
    expect(history.items).toHaveLength(1);
    expect(history.items[0].id).toBe(created.id);
    expect(history.meta.totalItems).toBe(1);
  });

  it('soft deletes only a transaction owned by the requested user', async () => {
    const user = await createTestUser(prisma, 'transactions-delete-owner');
    const otherUser = await createTestUser(prisma, 'transactions-delete-other');
    const transaction = await createTestTransaction(prisma, {
      userId: user.id,
      type: PrismaTransactionType.INCOME,
    });

    await expect(repository.softDelete(otherUser.id, transaction.id)).resolves.toBe(false);
    await expect(repository.softDelete(user.id, transaction.id)).resolves.toBe(true);
    await expect(repository.softDelete(user.id, transaction.id)).resolves.toBe(false);
  });
});
