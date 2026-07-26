import { Inject, Injectable } from '@nestjs/common';

import { ChartsResponseDto } from './dto/charts-response.dto';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { MonthlySummaryResponseDto } from './dto/monthly-summary-response.dto';
import { DashboardPeriod } from './entities/dashboard-summary.entity';
import { DashboardTransactionTotalsEntity } from './entities/dashboard-summary.entity';
import { Prisma } from '@prisma/client';
import {
  DASHBOARD_REPOSITORY,
  DashboardRepository,
} from './interfaces/dashboard-repository.interface';
import { DashboardService } from './interfaces/dashboard-service.interface';
import { DashboardMapper } from './mapper/dashboard.mapper';

@Injectable()
export class DashboardServiceImpl implements DashboardService {
  constructor(
    @Inject(DASHBOARD_REPOSITORY)
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async getMonthlySummary(
    userId: string,
    query: DashboardQueryDto,
  ): Promise<MonthlySummaryResponseDto> {
    const period = this.toPeriod(userId, query);
    const [
      totals,
      recurrenceTotals,
      investmentTotal,
      financialGoalContributionTotal,
      spendingByCategory,
      goals,
    ] = await Promise.all([
      this.dashboardRepository.getTransactionTotals(period),
      this.dashboardRepository.getPendingRecurrenceTotals(period),
      this.dashboardRepository.getInvestmentContributionTotal(period),
      this.dashboardRepository.getFinancialGoalContributionTotal(period),
      this.dashboardRepository.getSpendingByCategory(period),
      this.dashboardRepository.getGoalsByPeriod(period),
    ]);
    const charts = DashboardMapper.toCharts(period, spendingByCategory, goals);

    const projectedTotals = new DashboardTransactionTotalsEntity(
      new Prisma.Decimal(totals.totalIncome).plus(recurrenceTotals.totalIncome).toFixed(2),
      new Prisma.Decimal(totals.totalExpense).plus(recurrenceTotals.totalExpense).toFixed(2),
      totals.transactionCount + recurrenceTotals.recurrenceCount,
    );

    return DashboardMapper.toMonthlySummary(
      period,
      projectedTotals,
      charts.goalsByCategory,
      investmentTotal,
      financialGoalContributionTotal,
    );
  }

  async getCharts(userId: string, query: DashboardQueryDto): Promise<ChartsResponseDto> {
    const period = this.toPeriod(userId, query);
    const [spendingByCategory, goals] = await Promise.all([
      this.dashboardRepository.getSpendingByCategory(period),
      this.dashboardRepository.getGoalsByPeriod(period),
    ]);

    return DashboardMapper.toCharts(period, spendingByCategory, goals);
  }

  private toPeriod(userId: string, query: DashboardQueryDto): DashboardPeriod {
    return {
      userId,
      month: query.month,
      year: query.year,
    };
  }
}
