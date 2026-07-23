import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import { UploadedCsvFile } from '../interfaces/csv-row.interface';
import { CsvValidator } from '../validators/csv.validator';

describe('CsvValidator', () => {
  let validator: CsvValidator;

  beforeEach(() => {
    validator = new CsvValidator();
  });

  it('returns authenticated user id and rejects missing user id', () => {
    expect(validator.ensureAuthenticatedUserId('user-id')).toBe('user-id');
    expect(() => validator.ensureAuthenticatedUserId(undefined)).toThrow(UnauthorizedException);
  });

  it('accepts a non-empty CSV file by name or MIME type', () => {
    const file: UploadedCsvFile = {
      originalname: 'transactions.csv',
      mimetype: 'application/octet-stream',
      size: 10,
      buffer: Buffer.from('content'),
    };

    expect(validator.ensureCsvFile(file)).toBe(file);
  });

  it('rejects missing, empty and unsupported files', () => {
    expect(() => validator.ensureCsvFile(undefined)).toThrow(BadRequestException);
    expect(() =>
      validator.ensureCsvFile({
        originalname: 'transactions.csv',
        mimetype: 'text/csv',
        size: 0,
        buffer: Buffer.from(''),
      }),
    ).toThrow(BadRequestException);
    expect(() =>
      validator.ensureCsvFile({
        originalname: 'transactions.txt',
        mimetype: 'text/plain',
        size: 10,
        buffer: Buffer.from('content'),
      }),
    ).toThrow(BadRequestException);
  });

  it('parses valid transaction rows', () => {
    expect(
      validator.parseAndValidate(
        'type,amount,occurredAt,description,categoryId\n' +
          'INCOME,100.00,2026-07-03T00:00:00.000Z,Salary,550e8400-e29b-41d4-a716-446655440000\n' +
          'EXPENSE,20.50,2026-07-04T00:00:00.000Z,,',
      ),
    ).toEqual([
      {
        line: 2,
        type: TransactionType.INCOME,
        amount: '100.00',
        occurredAt: '2026-07-03T00:00:00.000Z',
        description: 'Salary',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
      },
      {
        line: 3,
        type: TransactionType.EXPENSE,
        amount: '20.50',
        occurredAt: '2026-07-04T00:00:00.000Z',
        description: undefined,
        categoryId: undefined,
      },
    ]);
  });

  it('throws a validation error with details for invalid CSV content', () => {
    expect(() =>
      validator.parseAndValidate(
        'type,amount,occurredAt,description,categoryId\n' +
          'OTHER,-1,not-a-date,description,invalid-category-id',
      ),
    ).toThrow(BadRequestException);
  });
});
