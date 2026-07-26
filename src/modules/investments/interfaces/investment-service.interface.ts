import { InvestmentQueryDto } from '../dto/investment-query.dto';
import {
  InvestmentContributionResponseDto,
  InvestmentOverviewResponseDto,
} from '../dto/investment-response.dto';
import { UpsertInvestmentContributionDto } from '../dto/upsert-investment-contribution.dto';

export const INVESTMENTS_SERVICE = Symbol('INVESTMENTS_SERVICE');

export interface InvestmentService {
  getOverview(userId: string, query: InvestmentQueryDto): Promise<InvestmentOverviewResponseDto>;
  upsertContribution(
    userId: string,
    dto: UpsertInvestmentContributionDto,
  ): Promise<InvestmentContributionResponseDto>;
  deleteContribution(userId: string, contributionId: string): Promise<void>;
}
