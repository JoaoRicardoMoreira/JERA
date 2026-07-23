import { ChartsResponseDto } from '../dto/charts-response.dto';
import { DashboardQueryDto } from '../dto/dashboard-query.dto';
import { MonthlySummaryResponseDto } from '../dto/monthly-summary-response.dto';

export const DASHBOARD_SERVICE = Symbol('DASHBOARD_SERVICE');

export interface DashboardService {
  getMonthlySummary(userId: string, query: DashboardQueryDto): Promise<MonthlySummaryResponseDto>;
  getCharts(userId: string, query: DashboardQueryDto): Promise<ChartsResponseDto>;
}
