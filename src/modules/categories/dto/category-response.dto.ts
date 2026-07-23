import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @ApiProperty({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Alimentacao' })
  @Expose()
  name: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @Expose()
  type: TransactionType;

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  @Expose()
  updatedAt: string;
}
