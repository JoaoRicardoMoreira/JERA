import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategorySpendingChartItemDto {
  @ApiProperty({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    format: 'uuid',
    nullable: true,
  })
  @Expose()
  categoryId: string | null;

  @ApiProperty({ example: 'Alimentacao' })
  @Expose()
  categoryName: string;

  @ApiProperty({ example: '780.25' })
  @Expose()
  amount: string;

  @ApiProperty({ example: 17.34 })
  @Expose()
  percentage: number;
}

export class GoalChartItemDto {
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
  goalAmount: string;

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
}

export class ChartsResponseDto {
  @ApiProperty({ example: 7 })
  @Expose()
  month: number;

  @ApiProperty({ example: 2026 })
  @Expose()
  year: number;

  @ApiProperty({ type: CategorySpendingChartItemDto, isArray: true })
  @Expose()
  spendingByCategory: CategorySpendingChartItemDto[];

  @ApiProperty({ type: GoalChartItemDto, isArray: true })
  @Expose()
  goalsByCategory: GoalChartItemDto[];
}
