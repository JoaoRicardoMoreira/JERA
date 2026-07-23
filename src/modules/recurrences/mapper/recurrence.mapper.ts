import {
  Prisma,
  Recurrence,
  RecurrenceFrequency,
  RecurrenceStatus as PrismaRecurrenceStatus,
  TransactionType as PrismaTransactionType,
} from '@prisma/client';

import { RecurrenceResponseDto } from '../dto/recurrence-response.dto';
import { RecurrenceEntity } from '../entities/recurrence.entity';
import { RecurrenceStatus } from '../entities/recurrence-status.enum';
import { TransactionType } from '../../transactions/entities/transaction-type.enum';

type PrismaRecurrence = Pick<
  Recurrence,
  | 'id'
  | 'userId'
  | 'categoryId'
  | 'amount'
  | 'type'
  | 'frequency'
  | 'status'
  | 'description'
  | 'startDate'
  | 'endDate'
  | 'lastProcessedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
  category?: {
    name: string;
  } | null;
};

export class RecurrenceMapper {
  static toPrismaType(type: TransactionType): PrismaTransactionType {
    return type as PrismaTransactionType;
  }

  static toDomainType(type: PrismaTransactionType): TransactionType {
    return type as TransactionType;
  }

  static toDomainStatus(status: PrismaRecurrenceStatus): RecurrenceStatus {
    return status as RecurrenceStatus;
  }

  static toEntity(recurrence: PrismaRecurrence): RecurrenceEntity {
    return new RecurrenceEntity(
      recurrence.id,
      recurrence.userId,
      recurrence.categoryId,
      recurrence.category?.name ?? null,
      new Prisma.Decimal(recurrence.amount).toFixed(2),
      RecurrenceMapper.toDomainType(recurrence.type),
      recurrence.frequency as RecurrenceFrequency,
      RecurrenceMapper.toDomainStatus(recurrence.status),
      recurrence.description,
      recurrence.startDate,
      recurrence.endDate,
      recurrence.lastProcessedAt,
      recurrence.createdAt,
      recurrence.updatedAt,
      recurrence.deletedAt,
    );
  }

  static toResponse(recurrence: RecurrenceEntity): RecurrenceResponseDto {
    return {
      id: recurrence.id,
      amount: recurrence.amount,
      type: recurrence.type,
      frequency: recurrence.frequency,
      status: recurrence.status,
      categoryId: recurrence.categoryId,
      categoryName: recurrence.categoryName,
      description: recurrence.description,
      startDate: recurrence.startDate.toISOString(),
      endDate: recurrence.endDate?.toISOString() ?? null,
      lastProcessedAt: recurrence.lastProcessedAt?.toISOString() ?? null,
      createdAt: recurrence.createdAt.toISOString(),
      updatedAt: recurrence.updatedAt.toISOString(),
    };
  }
}
