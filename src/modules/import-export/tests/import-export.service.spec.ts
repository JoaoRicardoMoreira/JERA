import { Test, TestingModule } from '@nestjs/testing';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import { TransactionsService } from '../../transactions/transactions.service';
import { ImportExportService } from '../import-export.service';
import { UploadedCsvFile } from '../interfaces/csv-row.interface';
import { CsvValidator } from '../validators/csv.validator';

describe('ImportExportService', () => {
  let service: ImportExportService;
  let transactionsService: jest.Mocked<
    Pick<TransactionsService, 'getTransactionsForExport' | 'importTransactions'>
  >;

  const userId = '2e3c3c78-26dc-4a97-8c6c-cc3b8f4e8f4c';
  const categoryId = '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67';

  beforeEach(async () => {
    transactionsService = {
      getTransactionsForExport: jest.fn(),
      importTransactions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportExportService,
        CsvValidator,
        {
          provide: TransactionsService,
          useValue: transactionsService,
        },
      ],
    }).compile();

    service = module.get(ImportExportService);
  });

  it('should export authenticated user transactions as CSV', async () => {
    transactionsService.getTransactionsForExport.mockResolvedValue([
      {
        id: '7f923c74-4c4b-4798-a5cf-d4098d561d70',
        amount: '125.50',
        type: TransactionType.EXPENSE,
        categoryId,
        categoryName: 'Alimentacao',
        description: 'Mercado',
        occurredAt: '2026-07-03T12:00:00.000Z',
        createdAt: '2026-07-03T12:01:00.000Z',
        updatedAt: '2026-07-03T12:01:00.000Z',
      },
    ]);

    const csv = await service.exportCsv(userId, {
      month: 7,
      year: 2026,
      type: TransactionType.EXPENSE,
    });

    expect(transactionsService.getTransactionsForExport).toHaveBeenCalledWith(userId, {
      month: 7,
      year: 2026,
      type: TransactionType.EXPENSE,
    });
    expect(csv).toBe(
      [
        'type,amount,occurredAt,description,categoryId',
        `EXPENSE,125.50,2026-07-03T12:00:00.000Z,Mercado,${categoryId}`,
      ].join('\n'),
    );
  });

  it('should validate and import a CSV file for the authenticated user', async () => {
    transactionsService.importTransactions.mockResolvedValue(1);

    const response = await service.importCsv(userId, buildCsvFile());

    expect(transactionsService.importTransactions).toHaveBeenCalledWith(userId, [
      {
        line: 2,
        type: TransactionType.INCOME,
        amount: '4500.00',
        occurredAt: '2026-07-03T12:00:00.000Z',
        description: 'Salario',
        categoryId: undefined,
      },
    ]);
    expect(response).toEqual({ importedCount: 1 });
  });

  it('should reject malformed CSV before persisting', async () => {
    await expect(
      service.importCsv(
        userId,
        buildCsvFile('type,amount,occurredAt,description,categoryId\nOTHER,abc,nope,,'),
      ),
    ).rejects.toMatchObject({
      response: {
        code: 'CSV_VALIDATION_ERROR',
      },
    });

    expect(transactionsService.importTransactions).not.toHaveBeenCalled();
  });

  function buildCsvFile(
    content = 'type,amount,occurredAt,description,categoryId\nINCOME,4500.00,2026-07-03T12:00:00.000Z,Salario,',
  ): UploadedCsvFile {
    return {
      originalname: 'transactions.csv',
      mimetype: 'text/csv',
      buffer: Buffer.from(content, 'utf8'),
      size: Buffer.byteLength(content),
    };
  }
});
