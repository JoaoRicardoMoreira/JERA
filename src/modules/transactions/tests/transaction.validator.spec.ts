import {
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { TransactionType } from '../entities/transaction-type.enum';
import { TransactionValidator } from '../validators/transaction.validator';

describe('TransactionValidator', () => {
  let validator: TransactionValidator;

  beforeEach(() => {
    validator = new TransactionValidator();
  });

  it('returns authenticated user id and rejects missing user id', () => {
    expect(validator.ensureAuthenticatedUserId('user-id')).toBe('user-id');
    expect(() => validator.ensureAuthenticatedUserId(undefined)).toThrow(UnauthorizedException);
  });

  it('throws when a transaction was not deleted', () => {
    expect(() => validator.ensureTransactionDeleted(false)).toThrow(NotFoundException);
    expect(() => validator.ensureTransactionDeleted(true)).not.toThrow();
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
});
