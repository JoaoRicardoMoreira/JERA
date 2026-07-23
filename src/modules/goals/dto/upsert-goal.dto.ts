import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDecimal, IsInt, IsUUID, Matches, Max, Min } from 'class-validator';

export class UpsertGoalDto {
  @ApiProperty({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    format: 'uuid',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: '1200.00',
    description: 'Valor decimal positivo da meta mensal.',
  })
  @IsDecimal({ decimal_digits: '1,2', force_decimal: false })
  @Matches(/^(?!0+(?:\.0{1,2})?$)\d+(?:\.\d{1,2})?$/)
  amount: string;

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
