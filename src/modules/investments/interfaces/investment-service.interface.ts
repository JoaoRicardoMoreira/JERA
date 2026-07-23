import { InvestmentQueryDto } from '../dto/investment-query.dto';
import {
  InvestmentContributionResponseDto,
  InvestmentOverviewResponseDto,
} from '../dto/investment-response.dto';
import { UpsertInvestmentConfigDto } from '../dto/upsert-investment-config.dto';
import { UpsertInvestmentContributionDto } from '../dto/upsert-investment-contribution.dto';

export const INVESTMENTS_SERVICE = Symbol('INVESTMENTS_SERVICE');

export interface InvestmentService {
  getOverview(userId: string, query: InvestmentQueryDto): Promise<InvestmentOverviewResponseDto>;
  updateConfig(
    userId: string,
    dto: UpsertInvestmentConfigDto,
  ): Promise<InvestmentOverviewResponseDto>;
  upsertContribution(
    userId: string,
    dto: UpsertInvestmentContributionDto,
  ): Promise<InvestmentContributionResponseDto>;
  deleteContribution(userId: string, contributionId: string): Promise<void>;
}
