import { RecurrenceFrequency } from '@prisma/client';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import { RecurrenceStatus } from './recurrence-status.enum';

export class RecurrenceEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly categoryId: string | null,
    public readonly categoryName: string | null,
    public readonly amount: string,
    public readonly type: TransactionType,
    public readonly frequency: RecurrenceFrequency,
    public readonly status: RecurrenceStatus,
    public readonly description: string | null,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly lastProcessedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}
