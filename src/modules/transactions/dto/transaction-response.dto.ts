import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { TransactionType } from '../entities/transaction-type.enum';

export class TransactionResponseDto {
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

  @ApiPropertyOptional({ example: 'Mercado', nullable: true })
  @Expose()
  description: string | null;

  @ApiProperty({ example: '2026-07-03T12:00:00.000Z' })
  @Expose()
  occurredAt: string;

  @ApiProperty({ example: '2026-07-03T12:00:00.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2026-07-03T12:00:00.000Z' })
  @Expose()
  updatedAt: string;
}
