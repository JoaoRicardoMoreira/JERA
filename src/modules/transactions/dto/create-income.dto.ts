import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDecimal,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({
    example: '3500.00',
    description: 'Valor decimal positivo da receita.',
  })
  @IsDecimal({ decimal_digits: '1,2', force_decimal: false })
  @Matches(/^(?!0+(?:\.0{1,2})?$)\d+(?:\.\d{1,2})?$/)
  amount: string;

  @ApiPropertyOptional({
    example: 'c4b77285-7f8a-4370-91d2-8fef73d58c7d',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Salario' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  @Type(() => String)
  description?: string;

  @ApiProperty({ example: '2026-07-03T12:00:00.000Z' })
  @IsDateString()
  occurredAt: string;
}
