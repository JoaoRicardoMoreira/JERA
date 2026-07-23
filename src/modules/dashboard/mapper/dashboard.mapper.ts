import { Prisma } from '@prisma/client';

import { ChartsResponseDto, GoalChartItemDto } from '../dto/charts-response.dto';
import { MonthlySummaryResponseDto } from '../dto/monthly-summary-response.dto';
import {
  DashboardCategorySpendingEntity,
  DashboardGoalEntity,
  DashboardPeriod,
  DashboardTransactionTotalsEntity,
} from '../entities/dashboard-summary.entity';

export class DashboardMapper {
  static toMonthlySummary(
    period: DashboardPeriod,
    totals: DashboardTransactionTotalsEntity,
    goals: GoalChartItemDto[],
    totalInvestment = '0.00',
  ): MonthlySummaryResponseDto {
    const totalIncome = new Prisma.Decimal(totals.totalIncome);
    const totalExpense = new Prisma.Decimal(totals.totalExpense);
    const investment = new Prisma.Decimal(totalInvestment);
    const totalGoalAmount = goals.reduce(
      (sum, goal) => sum.plus(goal.goalAmount),
      new Prisma.Decimal(0),
    );
    const totalGoalSpentAmount = goals.reduce(
      (sum, goal) => sum.plus(goal.spentAmount),
      new Prisma.Decimal(0),
    );
    const totalGoalRemainingAmount = Prisma.Decimal.max(
      totalGoalAmount.minus(totalGoalSpentAmount),
      0,
    );
    const progressPercentage = totalGoalAmount.isZero()
      ? 0
      : totalGoalSpentAmount.dividedBy(totalGoalAmount).times(100).toDecimalPlaces(2).toNumber();

    return {
      month: period.month,
      year: period.year,
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      totalInvestment: investment.toFixed(2),
      balance: totalIncome.minus(totalExpense).minus(investment).toFixed(2),
      transactionCount: totals.transactionCount,
      goals: {
        totalGoalAmount: totalGoalAmount.toFixed(2),
        totalGoalSpentAmount: totalGoalSpentAmount.toFixed(2),
        totalGoalRemainingAmount: totalGoalRemainingAmount.toFixed(2),
        progressPercentage,
        hasExceededGoals: goals.some((goal) => goal.isExceeded),
      },
    };
  }

  static toCharts(
    period: DashboardPeriod,
    spendingByCategory: DashboardCategorySpendingEntity[],
    goals: DashboardGoalEntity[],
  ): ChartsResponseDto {
    const totalExpense = spendingByCategory.reduce(
      (sum, item) => sum.plus(item.amount),
      new Prisma.Decimal(0),
    );
    const spendingMap = new Map(spendingByCategory.map((item) => [item.categoryId, item.amount]));

    return {
      month: period.month,
      year: period.year,
      spendingByCategory: spendingByCategory.map((item) => {
        const amount = new Prisma.Decimal(item.amount);
        const percentage = totalExpense.isZero()
          ? 0
          : amount.dividedBy(totalExpense).times(100).toDecimalPlaces(2).toNumber();

        return {
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          amount: amount.toFixed(2),
          percentage,
        };
      }),
      goalsByCategory: goals.map((goal) =>
        this.toGoalChartItem(goal, spendingMap.get(goal.categoryId) ?? '0.00'),
      ),
    };
  }

  private static toGoalChartItem(
    goal: DashboardGoalEntity,
    spentAmountValue: string,
  ): GoalChartItemDto {
    const goalAmount = new Prisma.Decimal(goal.amount);
    const spentAmount = new Prisma.Decimal(spentAmountValue);
    const remainingAmount = Prisma.Decimal.max(goalAmount.minus(spentAmount), 0);
    const progressPercentage = goalAmount.isZero()
      ? 0
      : spentAmount.dividedBy(goalAmount).times(100).toDecimalPlaces(2).toNumber();

    return {
      categoryId: goal.categoryId,
      categoryName: goal.categoryName,
      goalAmount: goalAmount.toFixed(2),
      spentAmount: spentAmount.toFixed(2),
      remainingAmount: remainingAmount.toFixed(2),
      progressPercentage,
      isExceeded: spentAmount.greaterThan(goalAmount),
    };
  }
}
