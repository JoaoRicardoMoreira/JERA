import { Test, TestingModule } from '@nestjs/testing';
import { RecurrenceFrequency } from '@prisma/client';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import { RecurrenceEntity } from '../entities/recurrence.entity';
import { RecurrenceStatus } from '../entities/recurrence-status.enum';
import {
  RECURRENCES_REPOSITORY,
  RecurrenceRepository,
} from '../interfaces/recurrence-repository.interface';
import { RecurrencesService } from '../recurrences.service';
import { RecurrenceValidator } from '../validators/recurrence.validator';

describe('RecurrencesService', () => {
  let service: RecurrencesService;
  let repository: jest.Mocked<RecurrenceRepository> & {
    processDueRecurrences: jest.Mock;
  };

  const userId = '2e3c3c78-26dc-4a97-8c6c-cc3b8f4e8f4c';
  const categoryId = '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67';
  const recurrence = new RecurrenceEntity(
    '7f923c74-4c4b-4798-a5cf-d4098d561d70',
    userId,
    categoryId,
    'Alimentacao',
    '125.50',
    TransactionType.EXPENSE,
    RecurrenceFrequency.MONTHLY,
    RecurrenceStatus.ACTIVE,
    'Assinatura mensal',
    new Date('2026-07-05T00:00:00.000Z'),
    null,
    null,
    new Date('2026-07-03T12:00:00.000Z'),
    new Date('2026-07-03T12:01:00.000Z'),
    null,
  );

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findActiveByUserId: jest.fn(),
      softDelete: jest.fn(),
      findCategoryForUser: jest.fn(),
      processDueRecurrences: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecurrencesService,
        RecurrenceValidator,
        {
          provide: RECURRENCES_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get(RecurrencesService);
  });

  it('should create a recurrence for the authenticated user', async () => {
    repository.findCategoryForUser.mockResolvedValue({
      id: categoryId,
      type: TransactionType.EXPENSE,
    });
    repository.create.mockResolvedValue(recurrence);

    const response = await service.createRecurrence(userId, {
      amount: '125.50',
      type: TransactionType.EXPENSE,
      frequency: RecurrenceFrequency.MONTHLY,
      categoryId,
      description: '  Assinatura   mensal ',
      startDate: '2026-07-05T00:00:00.000Z',
    });

    expect(repository.findCategoryForUser).toHaveBeenCalledWith(userId, categoryId);
    expect(repository.create).toHaveBeenCalledWith({
      userId,
      categoryId,
      amount: '125.50',
      type: TransactionType.EXPENSE,
      frequency: RecurrenceFrequency.MONTHLY,
      description: 'Assinatura mensal',
      startDate: new Date('2026-07-05T00:00:00.000Z'),
      endDate: undefined,
    });
    expect(response).toEqual({
      id: recurrence.id,
      amount: '125.50',
      type: TransactionType.EXPENSE,
      frequency: RecurrenceFrequency.MONTHLY,
      status: RecurrenceStatus.ACTIVE,
      categoryId,
      categoryName: 'Alimentacao',
      description: 'Assinatura mensal',
      startDate: '2026-07-05T00:00:00.000Z',
      endDate: null,
      lastProcessedAt: null,
      createdAt: '2026-07-03T12:00:00.000Z',
      updatedAt: '2026-07-03T12:01:00.000Z',
    });
  });

  it('should list active recurrences for the authenticated user', async () => {
    repository.findActiveByUserId.mockResolvedValue([recurrence]);

    const response = await service.listActiveRecurrences(userId);

    expect(repository.findActiveByUserId).toHaveBeenCalledWith(userId);
    expect(response).toHaveLength(1);
    expect(response[0]).toEqual(
      expect.objectContaining({
        id: recurrence.id,
        status: RecurrenceStatus.ACTIVE,
      }),
    );
  });

  it('should soft delete a recurrence owned by the authenticated user', async () => {
    repository.softDelete.mockResolvedValue(true);

    await service.deleteRecurrence(userId, recurrence.id);

    expect(repository.softDelete).toHaveBeenCalledWith(userId, recurrence.id);
  });

  it('should reject a category from a different transaction type', async () => {
    repository.findCategoryForUser.mockResolvedValue({
      id: categoryId,
      type: TransactionType.INCOME,
    });

    await expect(
      service.createRecurrence(userId, {
        amount: '125.50',
        type: TransactionType.EXPENSE,
        frequency: RecurrenceFrequency.MONTHLY,
        categoryId,
        startDate: '2026-07-05T00:00:00.000Z',
      }),
    ).rejects.toMatchObject({
      response: {
        code: 'RECURRENCE_CATEGORY_TYPE_MISMATCH',
      },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should reject an end date before the start date', async () => {
    await expect(
      service.createRecurrence(userId, {
        amount: '125.50',
        type: TransactionType.EXPENSE,
        frequency: RecurrenceFrequency.MONTHLY,
        startDate: '2026-07-05T00:00:00.000Z',
        endDate: '2026-07-04T00:00:00.000Z',
      }),
    ).rejects.toMatchObject({
      response: {
        code: 'RECURRENCE_END_DATE_BEFORE_START_DATE',
      },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should process active recurrences for the requested period', async () => {
    repository.findActiveByUserId.mockResolvedValue([recurrence]);
    repository.processDueRecurrences.mockResolvedValue({
      processedCount: 1,
      skippedCount: 0,
      createdTransactionIds: ['0a1cf1dc-f91a-4c3b-9219-ea2b5e85f3b4'],
    });

    const response = await service.processRecurrences(userId, {
      month: 7,
      year: 2026,
    });

    expect(repository.findActiveByUserId).toHaveBeenCalledWith(userId);
    expect(repository.processDueRecurrences).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        periodStart: new Date('2026-07-01T00:00:00.000Z'),
        periodEnd: new Date('2026-08-01T00:00:00.000Z'),
        recurrences: [
          expect.objectContaining({
            id: recurrence.id,
            categoryId: recurrence.categoryId,
            amount: recurrence.amount,
            type: recurrence.type,
            description: recurrence.description,
            occurredAt: new Date('2026-07-05T00:00:00.000Z'),
          }),
        ],
      }),
    );
    expect(response).toEqual({
      month: 7,
      year: 2026,
      processedCount: 1,
      skippedCount: 0,
      createdTransactionIds: ['0a1cf1dc-f91a-4c3b-9219-ea2b5e85f3b4'],
    });
  });

  it('should not duplicate recurrence processing in the same month', async () => {
    const alreadyProcessed = new RecurrenceEntity(
      recurrence.id,
      recurrence.userId,
      recurrence.categoryId,
      recurrence.categoryName,
      recurrence.amount,
      recurrence.type,
      recurrence.frequency,
      recurrence.status,
      recurrence.description,
      recurrence.startDate,
      recurrence.endDate,
      new Date('2026-07-10T10:00:00.000Z'),
      recurrence.createdAt,
      recurrence.updatedAt,
      recurrence.deletedAt,
    );

    repository.findActiveByUserId.mockResolvedValue([alreadyProcessed]);
    repository.processDueRecurrences.mockResolvedValue({
      processedCount: 0,
      skippedCount: 0,
      createdTransactionIds: [],
    });

    const response = await service.processRecurrences(userId, {
      month: 7,
      year: 2026,
    });

    expect(repository.processDueRecurrences).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrences: [],
      }),
    );
    expect(response).toEqual({
      month: 7,
      year: 2026,
      processedCount: 0,
      skippedCount: 1,
      createdTransactionIds: [],
    });
  });
});
