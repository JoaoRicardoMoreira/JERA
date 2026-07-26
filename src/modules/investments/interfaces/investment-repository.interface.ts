import { InvestmentConfigEntity } from '../entities/investment-config.entity';
import { InvestmentContributionEntity } from '../entities/investment-contribution.entity';

export const INVESTMENTS_REPOSITORY = Symbol('INVESTMENTS_REPOSITORY');

export interface UpsertInvestmentConfigData {
  userId: string;
  taxaMensalPercent: string;
}

export interface UpsertInvestmentContributionData {
  userId: string;
  amount: string;
  contributedAt: Date;
  month: number;
  year: number;
  selicAnnualRatePercent: string;
  selicReferenceDate: Date;
}

export interface SetContributionSelicRateData {
  userId: string;
  contributionId: string;
  selicAnnualRatePercent: string;
  selicReferenceDate: Date;
}

export interface InvestmentRepository {
  getOrCreateConfig(userId: string): Promise<InvestmentConfigEntity>;
  upsertConfig(data: UpsertInvestmentConfigData): Promise<InvestmentConfigEntity>;
  findContributionsByUserId(userId: string): Promise<InvestmentContributionEntity[]>;
  upsertContribution(data: UpsertInvestmentContributionData): Promise<InvestmentContributionEntity>;
  setContributionSelicRate(
    data: SetContributionSelicRateData,
  ): Promise<InvestmentContributionEntity>;
  softDeleteContribution(userId: string, contributionId: string): Promise<boolean>;
}
