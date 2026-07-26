import { FinancialGoalCategory, FinancialGoalStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFinancialGoalDto {
  @ApiProperty({ example: 'Apartamento' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: '364000.00' })
  @IsNumberString()
  targetAmount: string;

  @ApiPropertyOptional({ example: '240000.00', default: '0.00' })
  @IsOptional()
  @IsNumberString()
  currentAmount?: string;

  @ApiPropertyOptional({ example: '2029-07-01' })
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional({ example: 'home' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  icon?: string;

  @ApiPropertyOptional({ enum: FinancialGoalCategory, default: FinancialGoalCategory.OTHER })
  @IsOptional()
  @IsIn(Object.values(FinancialGoalCategory))
  category?: FinancialGoalCategory;
}

export class UpdateFinancialGoalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  targetAmount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  icon?: string;

  @ApiPropertyOptional({ enum: FinancialGoalCategory })
  @IsOptional()
  @IsIn(Object.values(FinancialGoalCategory))
  category?: FinancialGoalCategory;

  @ApiPropertyOptional({ enum: FinancialGoalStatus })
  @IsOptional()
  @IsIn(Object.values(FinancialGoalStatus))
  status?: FinancialGoalStatus;
}

export class CreateFinancialGoalContributionDto {
  @ApiProperty({ example: '500.00' })
  @IsNumberString()
  amount: string;

  @ApiPropertyOptional({ example: '2026-07-26' })
  @IsOptional()
  @IsDateString()
  contributedAt?: string;
}

export class FinancialGoalContributionResponseDto {
  @Expose() id: string;
  @Expose() financialGoalId: string;
  @Expose() amount: string;
  @Expose() contributedAt: string;
  @Expose() createdAt: string;
}

export class FinancialGoalResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() targetAmount: string;
  @Expose() currentAmount: string;
  @Expose() remainingAmount: string;
  @Expose() progressPercentage: number;
  @Expose() targetDate: string | null;
  @Expose() estimatedCompletion: string | null;
  @Expose() icon: string | null;
  @Expose() category: FinancialGoalCategory;
  @Expose() status: FinancialGoalStatus;
}
