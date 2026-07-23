import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import { RecurrenceValidator } from '../validators/recurrence.validator';

describe('RecurrenceValidator', () => {
  let validator: RecurrenceValidator;

  beforeEach(() => {
    validator = new RecurrenceValidator();
  });

  it('returns authenticated user id and rejects missing user id', () => {
    expect(validator.ensureAuthenticatedUserId('user-id')).toBe('user-id');
    expect(() => validator.ensureAuthenticatedUserId(undefined)).toThrow(UnauthorizedException);
  });

  it('validates category existence and type compatibility', () => {
    expect(() =>
      validator.ensureCategoryMatchesTransactionType(null, TransactionType.EXPENSE),
    ).toThrow(NotFoundException);
    expect(() =>
      validator.ensureCategoryMatchesTransactionType(
        { id: 'category-id', type: TransactionType.INCOME },
        TransactionType.EXPENSE,
      ),
    ).toThrow(UnprocessableEntityException);
    expect(() =>
      validator.ensureCategoryMatchesTransactionType(
        { id: 'category-id', type: TransactionType.EXPENSE },
        TransactionType.EXPENSE,
      ),
    ).not.toThrow();
  });

  it('validates recurrence periods', () => {
    const startDate = new Date('2026-07-01T00:00:00.000Z');

    expect(() => validator.ensureValidPeriod(new Date('invalid-date'))).toThrow(
      BadRequestException,
    );
    expect(() => validator.ensureValidPeriod(startDate, new Date('invalid-date'))).toThrow(
      BadRequestException,
    );
    expect(() =>
      validator.ensureValidPeriod(startDate, new Date('2026-06-30T00:00:00.000Z')),
    ).toThrow(UnprocessableEntityException);
    expect(() => validator.ensureValidPeriod(startDate, startDate)).not.toThrow();
  });

  it('throws when recurrence was not deleted', () => {
    expect(() => validator.ensureRecurrenceDeleted(false)).toThrow(NotFoundException);
    expect(() => validator.ensureRecurrenceDeleted(true)).not.toThrow();
  });
});
