import { PayableOrigin, PayableStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class PayableQueryDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;
}

export class CreatePayableDto extends PayableQueryDto {
  @ApiProperty({ example: 'Internet' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: '99.90' })
  @IsNumberString()
  amount: string;

  @ApiProperty({ example: '2026-07-29' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class PayableResponseDto {
  @Expose() id: string;
  @Expose() recurrenceId: string | null;
  @Expose() transactionId: string | null;
  @Expose() categoryId: string | null;
  @Expose() categoryName: string | null;
  @Expose() description: string;
  @Expose() amount: string;
  @Expose() competenceMonth: number;
  @Expose() competenceYear: number;
  @Expose() dueDate: string;
  @Expose() status: PayableStatus | 'OVERDUE';
  @Expose() origin: PayableOrigin;
  @Expose() paidAt: string | null;
  @Expose() daysUntilDue: number;
}

export class PayableGenerationResponseDto {
  @Expose() generatedCount: number;
}
