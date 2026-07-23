import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, Matches } from 'class-validator';

export class UpsertInvestmentConfigDto {
  @ApiProperty({
    example: '0.80',
    description: 'Taxa de rendimento mensal em percentual.',
  })
  @IsDecimal({ decimal_digits: '1,4', force_decimal: false })
  @Matches(/^\d+(?:\.\d{1,4})?$/)
  taxaMensalPercent: string;
}
