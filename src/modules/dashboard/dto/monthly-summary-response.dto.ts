import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GoalSummaryResponseDto {
  @ApiProperty({ example: '3500.00' })
  @Expose()
  totalGoalAmount: string;

  @ApiProperty({ example: '1900.50' })
  @Expose()
  totalGoalSpentAmount: string;

  @ApiProperty({ example: '1599.50' })
  @Expose()
  totalGoalRemainingAmount: string;

  @ApiProperty({ example: 54.3 })
  @Expose()
  progressPercentage: number;

  @ApiProperty({ example: false })
  @Expose()
  hasExceededGoals: boolean;
}

export class MonthlySummaryResponseDto {
  @ApiProperty({ example: 7 })
  @Expose()
  month: number;

  @ApiProperty({ example: 2026 })
  @Expose()
  year: number;

  @ApiProperty({ example: '7000.00' })
  @Expose()
  totalIncome: string;

  @ApiProperty({ example: '4500.00' })
  @Expose()
  totalExpense: string;

  @ApiProperty({ example: '2000.00' })
  @Expose()
  totalInvestment: string;

  @ApiProperty({ example: '2500.00' })
  @Expose()
  balance: string;

  @ApiProperty({ example: 12 })
  @Expose()
  transactionCount: number;

  @ApiProperty({ type: GoalSummaryResponseDto })
  @Expose()
  goals: GoalSummaryResponseDto;
}
