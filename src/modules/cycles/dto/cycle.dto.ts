import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class CycleQueryDto {
  @ApiProperty({ example: 7, minimum: 1, maximum: 12 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 2026, minimum: 2000, maximum: 2100 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;
}

export type CycleEventType = 'INCOME' | 'EXPENSE' | 'INVESTMENT' | 'GOAL';
export type CycleEventStatus = 'REALIZED' | 'PLANNED' | 'OVERDUE';

export interface CycleEventDto {
  id: string;
  type: CycleEventType;
  status: CycleEventStatus;
  date: string;
  day: number;
  title: string;
  categoryName: string | null;
  amount: string;
  balanceAfter: string;
}

export interface CyclePointDto {
  day: number;
  date: string;
  projectedBalance: string;
  realizedBalance: string | null;
  income: string;
  expense: string;
}

export interface CycleMapDto {
  month: number;
  year: number;
  asOfDate: string;
  availableBalance: string;
  projectedBalance: string;
  projectedIncome: string;
  projectedExpense: string;
  totalInvestment: string;
  totalGoalContribution: string;
  lowestBalance: string;
  lowestBalanceDate: string;
  daysAtRisk: number;
  events: CycleEventDto[];
  points: CyclePointDto[];
}

export interface CycleClosingDto {
  available: boolean;
  reviewedAt: string | null;
  realizedIncome: string;
  realizedExpense: string;
  investedAmount: string;
  goalContributionAmount: string;
  endingBalance: string;
  balanceDelta: string;
  savingsRate: number;
  budgetCount: number;
  respectedBudgetCount: number;
  completedGoals: number;
  completedJourneys: number;
  achievements: string[];
  message: string;
}

export interface CycleOverviewDto {
  map: CycleMapDto;
  closing: CycleClosingDto;
}
