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

export class UpdateTransactionDto {
  @ApiProperty({
    example: '125.50',
    description: 'Novo valor decimal positivo da transacao.',
  })
  @IsDecimal({ decimal_digits: '1,2', force_decimal: false })
  @Matches(/^(?!0+(?:\.0{1,2})?$)\d+(?:\.\d{1,2})?$/)
  amount: string;

  @ApiPropertyOptional({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({ example: 'Mercado' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  @Type(() => String)
  description?: string;

  @ApiProperty({ example: '2026-07-03T12:00:00.000Z' })
  @IsDateString()
  occurredAt: string;
}
