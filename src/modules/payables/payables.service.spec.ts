import {
  PayableOrigin,
  PayableStatus,
  Prisma,
  RecurrenceFrequency,
  RecurrenceStatus,
  TransactionType,
} from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { PayablesService } from './payables.service';

describe('PayablesService', () => {
  const dueDate = new Date('2026-07-05T12:00:00.000Z');
  const payable = {
    id: 'payable-id',
    userId: 'user-id',
    recurrenceId: 'recurrence-id',
    transactionId: null,
    categoryId: 'category-id',
    description: 'Internet',
    amount: new Prisma.Decimal('99.90'),
    competenceMonth: 7,
    competenceYear: 2026,
    dueDate,
    status: PayableStatus.PENDING,
    origin: PayableOrigin.RECURRENCE,
    paidAt: null,
    createdAt: dueDate,
    updatedAt: dueDate,
    deletedAt: null,
  };
  const tx = {
    payable: {
      findFirst: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    transaction: { create: jest.fn() },
  };
  const prisma = {
    recurrence: { findMany: jest.fn() },
    payable: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(tx)),
  };
  const service = new PayablesService(prisma as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('generates one payable for a monthly expense recurrence in the requested competence', async () => {
    prisma.recurrence.findMany.mockResolvedValue([
      {
        id: 'recurrence-id',
        categoryId: 'category-id',
        description: 'Internet',
        amount: new Prisma.Decimal('99.90'),
        frequency: RecurrenceFrequency.MONTHLY,
        status: RecurrenceStatus.ACTIVE,
        type: TransactionType.EXPENSE,
        startDate: new Date('2026-01-05T12:00:00.000Z'),
      },
    ]);
    prisma.payable.createMany.mockResolvedValue({ count: 1 });

    const result = await service.generateForPeriod('user-id', { month: 7, year: 2026 });

    expect(result.generatedCount).toBe(1);
    expect(prisma.payable.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skipDuplicates: true,
        data: [
          expect.objectContaining({
            recurrenceId: 'recurrence-id',
            competenceMonth: 7,
            competenceYear: 2026,
          }),
        ],
      }),
    );
  });

  it('creates the expense and links it atomically when a payable is paid', async () => {
    tx.payable.findFirst.mockResolvedValue(payable);
    tx.transaction.create.mockResolvedValue({ id: 'transaction-id' });
    tx.payable.update.mockResolvedValue({
      ...payable,
      transactionId: 'transaction-id',
      status: PayableStatus.PAID,
      paidAt: dueDate,
      category: { name: 'Casa' },
    });

    const result = await service.markPaid('user-id', 'payable-id');

    expect(tx.transaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: TransactionType.EXPENSE,
        occurredAt: dueDate,
      }),
    });
    expect(result.transactionId).toBe('transaction-id');
    expect(result.status).toBe(PayableStatus.PAID);
  });

  it('does not create a second transaction when the payable is already paid', async () => {
    tx.payable.findFirst.mockResolvedValue({
      ...payable,
      status: PayableStatus.PAID,
      transactionId: 'transaction-id',
    });
    tx.payable.findUniqueOrThrow.mockResolvedValue({
      ...payable,
      status: PayableStatus.PAID,
      transactionId: 'transaction-id',
      category: null,
    });

    await service.markPaid('user-id', 'payable-id');

    expect(tx.transaction.create).not.toHaveBeenCalled();
  });
});
