import { ApiProperty } from '@nestjs/swagger';
import {
  SettlementAtmosphere,
  SettlementJourneyStatus,
  SettlementJourneyType,
  SettlementJourneyUnit,
} from '@prisma/client';

export class SettlementStageDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  progressPercentage: number;

  @ApiProperty()
  microMilestone: number;

  @ApiProperty({ nullable: true })
  nextStageLabel: string | null;

  @ApiProperty()
  pointsToNextStage: number;

  @ApiProperty()
  assetKey: string;
}

export class SettlementAtmosphereDto {
  @ApiProperty({ enum: SettlementAtmosphere })
  state: SettlementAtmosphere;

  @ApiProperty()
  reason: string;
}

export class SettlementDistrictDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  progressPercentage: number;
}

export class SettlementJourneyDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: SettlementJourneyType })
  type: SettlementJourneyType;

  @ApiProperty({ enum: SettlementJourneyUnit })
  unit: SettlementJourneyUnit;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  baselineValue: string;

  @ApiProperty()
  targetValue: string;

  @ApiProperty()
  currentValue: string;

  @ApiProperty()
  progressPercentage: number;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty({ enum: SettlementJourneyStatus })
  status: SettlementJourneyStatus;

  @ApiProperty({ nullable: true })
  completedAt: string | null;
}

export class SettlementOverviewDto {
  @ApiProperty({ type: SettlementStageDto })
  stage: SettlementStageDto;

  @ApiProperty({ type: SettlementAtmosphereDto })
  atmosphere: SettlementAtmosphereDto;

  @ApiProperty()
  patrimony: string;

  @ApiProperty()
  patrimonyDelta: string;

  @ApiProperty()
  availableBalance: string;

  @ApiProperty()
  investmentValue: string;

  @ApiProperty()
  goalReserveValue: string;

  @ApiProperty()
  fenrirMessage: string;

  @ApiProperty()
  nextExpansion: string;

  @ApiProperty({ type: [SettlementDistrictDto] })
  districts: SettlementDistrictDto[];

  @ApiProperty({ type: [SettlementJourneyDto] })
  journeys: SettlementJourneyDto[];

  @ApiProperty()
  reconstructedAt: string;
}
