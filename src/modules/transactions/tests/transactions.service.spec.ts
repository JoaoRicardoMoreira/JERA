import { Test, TestingModule } from '@nestjs/testing';

import { PaginatedResult } from '../../../common/interfaces/pagination.interface';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionType } from '../entities/transaction-type.enum';
import {
  TRANSACTIONS_REPOSITORY,
  TransactionRepository,
} from '../interfaces/transaction-repository.interface';
import { TransactionsService } from '../transactions.service';
import { TransactionValidator } from '../validators/transaction.validator';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: jest.Mocked<TransactionRepository>;

  const userId = '2e3c3c78-26dc-4a97-8c6c-cc3b8f4e8f4c';
  const categoryId = '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67';
  const transaction = new TransactionEntity(
    '7f923c74-4c4b-4798-a5cf-d4098d561d70',
    userId,
    categoryId,
    '125.50',
    TransactionType.EXPENSE,
    'Mercado',
    new Date('2026-07-03T12:00:00.000Z'),
    new Date('2026-07-03T12:01:00.000Z'),
    new Date('2026-07-03T12:01:00.000Z'),
    null,
    'Alimentacao',
  );

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findHistory: jest.fn(),
      softDelete: jest.fn(),
      findCategoryForUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        TransactionValidator,
        {
          provide: TRANSACTIONS_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get(TransactionsService);
  });

  it('should create an expense for the authenticated user', async () => {
    repository.findCategoryForUser.mockResolvedValue({
      id: categoryId,
      type: TransactionType.EXPENSE,
    });
    repository.create.mockResolvedValue(transaction);

    const response = await service.createExpense(userId, {
      amount: '125.50',
      categoryId,
      description: '  Mercado   ',
      occurredAt: '2026-07-03T12:00:00.000Z',
    });

    expect(repository.findCategoryForUser).toHaveBeenCalledWith(userId, categoryId);
    expect(repository.create).toHaveBeenCalledWith({
      userId,
      categoryId,
      amount: '125.50',
      type: TransactionType.EXPENSE,
      description: 'Mercado',
      occurredAt: new Date('2026-07-03T12:00:00.000Z'),
    });
    expect(response).toEqual({
      id: transaction.id,
      amount: '125.50',
      type: TransactionType.EXPENSE,
      categoryId,
      categoryName: 'Alimentacao',
      description: 'Mercado',
      occurredAt: '2026-07-03T12:00:00.000Z',
      createdAt: '2026-07-03T12:01:00.000Z',
      updatedAt: '2026-07-03T12:01:00.000Z',
    });
  });

  it('should create an income without category', async () => {
    const income = new TransactionEntity(
      transaction.id,
      userId,
      null,
      '3500.00',
      TransactionType.INCOME,
      'Salario',
      transaction.occurredAt,
      transaction.createdAt,
      transaction.updatedAt,
      null,
      null,
    );
    repository.create.mockResolvedValue(income);

    const response = await service.createIncome(userId, {
      amount: '3500.00',
      description: 'Salario',
      occurredAt: '2026-07-03T12:00:00.000Z',
    });

    expect(repository.findCategoryForUser).not.toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalledWith({
      userId,
      categoryId: undefined,
      amount: '3500.00',
      type: TransactionType.INCOME,
      description: 'Salario',
      occurredAt: new Date('2026-07-03T12:00:00.000Z'),
    });
    expect(response.type).toBe(TransactionType.INCOME);
    expect(response.categoryId).toBeNull();
  });

  it('should list history by period and type', async () => {
    const paginated: PaginatedResult<TransactionEntity> = {
      items: [transaction],
      meta: {
        page: 1,
        limit: 20,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    repository.findHistory.mockResolvedValue(paginated);

    const response = await service.getHistory(userId, {
      month: 7,
      year: 2026,
      type: TransactionType.EXPENSE,
      page: 1,
      limit: 20,
    });

    expect(repository.findHistory).toHaveBeenCalledWith({
      userId,
      month: 7,
      year: 2026,
      type: TransactionType.EXPENSE,
      page: 1,
      limit: 20,
    });
    expect(response.items).toHaveLength(1);
    expect(response.meta.totalItems).toBe(1);
  });

  it('should soft delete a transaction owned by the authenticated user', async () => {
    repository.softDelete.mockResolvedValue(true);

    await service.deleteTransaction(userId, transaction.id);

    expect(repository.softDelete).toHaveBeenCalledWith(userId, transaction.id);
  });

  it('should reject a category from a different type', async () => {
    repository.findCategoryForUser.mockResolvedValue({
      id: categoryId,
      type: TransactionType.INCOME,
    });

    await expect(
      service.createExpense(userId, {
        amount: '125.50',
        categoryId,
        occurredAt: '2026-07-03T12:00:00.000Z',
      }),
    ).rejects.toMatchObject({
      response: {
        code: 'CATEGORY_TYPE_MISMATCH',
      },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });
});
