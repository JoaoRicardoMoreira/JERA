import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GoalResponseDto {
  @ApiProperty({
    example: '7f923c74-4c4b-4798-a5cf-d4098d561d70',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    format: 'uuid',
  })
  @Expose()
  categoryId: string;

  @ApiProperty({ example: 'Alimentacao' })
  @Expose()
  categoryName: string;

  @ApiProperty({ example: '1200.00' })
  @Expose()
  amount: string;

  @ApiProperty({ example: '780.25' })
  @Expose()
  spentAmount: string;

  @ApiProperty({ example: '419.75' })
  @Expose()
  remainingAmount: string;

  @ApiProperty({ example: 65.02 })
  @Expose()
  progressPercentage: number;

  @ApiProperty({ example: false })
  @Expose()
  isExceeded: boolean;

  @ApiProperty({ example: 7 })
  @Expose()
  month: number;

  @ApiProperty({ example: 2026 })
  @Expose()
  year: number;

  @ApiProperty({ example: '2026-07-03T12:00:00.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2026-07-03T12:00:00.000Z' })
  @Expose()
  updatedAt: string;
}
