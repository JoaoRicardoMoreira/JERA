import { RecurrenceFrequency } from '@prisma/client';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import { RecurrenceEntity } from '../entities/recurrence.entity';

export const RECURRENCES_REPOSITORY = Symbol('RECURRENCES_REPOSITORY');

export interface CreateRecurrenceData {
  userId: string;
  categoryId?: string;
  amount: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  description?: string;
  startDate: Date;
  endDate?: Date;
}

export interface RecurrenceCategoryReference {
  id: string;
  type: TransactionType;
}

export interface RecurrenceRepository {
  create(data: CreateRecurrenceData): Promise<RecurrenceEntity>;
  findActiveByUserId(userId: string): Promise<RecurrenceEntity[]>;
  softDelete(userId: string, recurrenceId: string): Promise<boolean>;
  findCategoryForUser(
    userId: string,
    categoryId: string,
  ): Promise<RecurrenceCategoryReference | null>;
}
