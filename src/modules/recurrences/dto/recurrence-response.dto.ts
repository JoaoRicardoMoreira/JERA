import { RecurrenceFrequency } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import { RecurrenceStatus } from '../entities/recurrence-status.enum';

export class RecurrenceResponseDto {
  @ApiProperty({
    example: '7f923c74-4c4b-4798-a5cf-d4098d561d70',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({ example: '125.50' })
  @Expose()
  amount: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @Expose()
  type: TransactionType;

  @ApiProperty({ enum: RecurrenceFrequency, example: RecurrenceFrequency.MONTHLY })
  @Expose()
  frequency: RecurrenceFrequency;

  @ApiProperty({ enum: RecurrenceStatus, example: RecurrenceStatus.ACTIVE })
  @Expose()
  status: RecurrenceStatus;

  @ApiPropertyOptional({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    format: 'uuid',
    nullable: true,
  })
  @Expose()
  categoryId: string | null;

  @ApiPropertyOptional({ example: 'Alimentacao', nullable: true })
  @Expose()
  categoryName: string | null;

  @ApiPropertyOptional({ example: 'Assinatura mensal', nullable: true })
  @Expose()
  description: string | null;

  @ApiProperty({ example: '2026-07-05T00:00:00.000Z' })
  @Expose()
  startDate: string;

  @ApiPropertyOptional({ example: '2026-12-05T00:00:00.000Z', nullable: true })
  @Expose()
  endDate: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @Expose()
  lastProcessedAt: string | null;

  @ApiProperty({ example: '2026-07-03T12:00:00.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2026-07-03T12:00:00.000Z' })
  @Expose()
  updatedAt: string;
}
