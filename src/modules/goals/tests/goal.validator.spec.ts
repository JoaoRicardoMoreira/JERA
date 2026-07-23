import {
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';

import { GoalValidator } from '../validators/goal.validator';

describe('GoalValidator', () => {
  let validator: GoalValidator;

  beforeEach(() => {
    validator = new GoalValidator();
  });

  it('returns authenticated user id and rejects missing user id', () => {
    expect(validator.ensureAuthenticatedUserId('user-id')).toBe('user-id');
    expect(() => validator.ensureAuthenticatedUserId(undefined)).toThrow(UnauthorizedException);
  });

  it('accepts only existing expense categories', () => {
    expect(() => validator.ensureExpenseCategory(null)).toThrow(NotFoundException);
    expect(() =>
      validator.ensureExpenseCategory({ id: 'category-id', type: TransactionType.INCOME }),
    ).toThrow(UnprocessableEntityException);
    expect(() =>
      validator.ensureExpenseCategory({ id: 'category-id', type: TransactionType.EXPENSE }),
    ).not.toThrow();
  });
});
