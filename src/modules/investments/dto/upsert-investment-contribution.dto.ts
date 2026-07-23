import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDecimal, Matches } from 'class-validator';

export class UpsertInvestmentContributionDto {
  @ApiProperty({
    example: '500.00',
    description: 'Valor do aporte mensal.',
  })
  @IsDecimal({ decimal_digits: '1,2', force_decimal: false })
  @Matches(/^\d+(?:\.\d{1,2})?$/)
  amount: string;

  @ApiProperty({
    example: '2026-01-01T12:00:00.000Z',
    description: 'Data efetiva em que o aporte começou a render.',
  })
  @IsDateString()
  contributedAt: string;
}
