import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class InvestmentConfigResponseDto {
  @ApiProperty({ example: '7f923c74-4c4b-4798-a5cf-d4098d561d70', format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ example: '0.8000' })
  @Expose()
  taxaMensalPercent: string;

  @ApiProperty({ example: '2026-07-04T12:00:00.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2026-07-04T12:00:00.000Z' })
  @Expose()
  updatedAt: string;
}

export class InvestmentContributionResponseDto {
  @ApiProperty({ example: '7f923c74-4c4b-4798-a5cf-d4098d561d70', format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ example: '500.00' })
  @Expose()
  amount: string;

  @ApiProperty({ example: '2026-01-01T12:00:00.000Z' })
  @Expose()
  contributedAt: string;

  @ApiProperty({ example: 7 })
  @Expose()
  month: number;

  @ApiProperty({ example: 2026 })
  @Expose()
  year: number;

  @ApiProperty({ example: '2026-07-04T12:00:00.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2026-07-04T12:00:00.000Z' })
  @Expose()
  updatedAt: string;
}

export class InvestmentTimelinePointResponseDto {
  @ApiProperty({ example: '2026-07' })
  @Expose()
  key: string;

  @ApiProperty({ example: 2026 })
  @Expose()
  year: number;

  @ApiProperty({ example: 7 })
  @Expose()
  month: number;

  @ApiProperty({ example: 'Jul/2026' })
  @Expose()
  label: string;

  @ApiProperty({ example: '500.00' })
  @Expose()
  aporte: string;

  @ApiProperty({ example: '504.00' })
  @Expose()
  patrimonio: string;
}

export class InvestmentOverviewResponseDto {
  @ApiProperty({ type: InvestmentConfigResponseDto })
  @Expose()
  config: InvestmentConfigResponseDto;

  @ApiProperty({ type: InvestmentContributionResponseDto, isArray: true })
  @Expose()
  contributions: InvestmentContributionResponseDto[];

  @ApiProperty({ type: InvestmentContributionResponseDto, nullable: true })
  @Expose()
  currentContribution: InvestmentContributionResponseDto | null;

  @ApiProperty({ type: InvestmentTimelinePointResponseDto, isArray: true })
  @Expose()
  timeline: InvestmentTimelinePointResponseDto[];

  @ApiProperty({ example: '1500.00' })
  @Expose()
  totalAportado: string;

  @ApiProperty({ example: '1538.45' })
  @Expose()
  patrimonioFinal: string;

  @ApiProperty({ example: 10.03 })
  @Expose()
  annualEquivalentPercent: number;
}
