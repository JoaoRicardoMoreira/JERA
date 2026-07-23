import { Prisma, TransactionType as PrismaTransactionType } from '@prisma/client';

import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionType } from '../entities/transaction-type.enum';
import { TransactionMapper } from '../mapper/transaction.mapper';

describe('TransactionMapper', () => {
  const occurredAt = new Date('2026-07-03T12:00:00.000Z');
  const createdAt = new Date('2026-07-03T13:00:00.000Z');
  const updatedAt = new Date('2026-07-03T14:00:00.000Z');

  it('maps Prisma transactions to domain entities with decimal amounts and category name', () => {
    const entity = TransactionMapper.toEntity({
      id: 'transaction-id',
      userId: 'user-id',
      categoryId: 'category-id',
      amount: new Prisma.Decimal('12.5'),
      type: PrismaTransactionType.EXPENSE,
      description: 'Lunch',
      occurredAt,
      createdAt,
      updatedAt,
      deletedAt: null,
      category: { name: 'Food' },
    });

    expect(entity).toBeInstanceOf(TransactionEntity);
    expect(entity).toMatchObject({
      amount: '12.50',
      type: TransactionType.EXPENSE,
      categoryName: 'Food',
    });
  });

  it('maps domain entities to API responses', () => {
    const response = TransactionMapper.toResponse(
      new TransactionEntity(
        'transaction-id',
        'user-id',
        null,
        '200.00',
        TransactionType.INCOME,
        null,
        occurredAt,
        createdAt,
        updatedAt,
        null,
        null,
      ),
    );

    expect(response).toEqual({
      id: 'transaction-id',
      amount: '200.00',
      type: TransactionType.INCOME,
      categoryId: null,
      categoryName: null,
      description: null,
      occurredAt: occurredAt.toISOString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });
});
