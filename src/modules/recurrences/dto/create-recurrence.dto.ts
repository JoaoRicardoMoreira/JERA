import { RecurrenceFrequency } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';

export class CreateRecurrenceDto {
  @ApiProperty({
    example: '125.50',
    description: 'Valor decimal positivo da recorrencia.',
  })
  @IsDecimal({ decimal_digits: '1,2', force_decimal: false })
  @Matches(/^(?!0+(?:\.0{1,2})?$)\d+(?:\.\d{1,2})?$/)
  amount: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ enum: RecurrenceFrequency, example: RecurrenceFrequency.MONTHLY })
  @IsEnum(RecurrenceFrequency)
  frequency: RecurrenceFrequency;

  @ApiPropertyOptional({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Assinatura mensal' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  @Type(() => String)
  description?: string;

  @ApiProperty({
    example: '2026-07-05T00:00:00.000Z',
    description:
      'Data inicial da recorrencia. Para recorrencias mensais, o dia desta data define o dia recorrente.',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    example: '2026-12-05T00:00:00.000Z',
    description: 'Data final opcional da recorrencia.',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
