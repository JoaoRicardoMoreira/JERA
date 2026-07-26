import { Injectable } from '@nestjs/common';
import { Prisma, RecurrenceFrequency, RecurrenceStatus, TransactionType } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import {
  DashboardCategorySpendingEntity,
  DashboardGoalEntity,
  DashboardPeriod,
  DashboardRecurrenceTotalsEntity,
  DashboardTransactionTotalsEntity,
} from './entities/dashboard-summary.entity';
import { DashboardRepository } from './interfaces/dashboard-repository.interface';

@Injectable()
export class DashboardRepositoryImpl implements DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTransactionTotals(period: DashboardPeriod): Promise<DashboardTransactionTotalsEntity> {
    const { periodStart, periodEnd } = this.getPeriodRange(period);
    const [income, expense, transactionCount] = await this.prisma.$transaction([
      this.prisma.transaction.aggregate({
        where: {
          userId: period.userId,
          type: TransactionType.INCOME,
          deletedAt: null,
          occurredAt: {
            gte: periodStart,
            lt: periodEnd,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.transaction.aggregate({
        where: {
          userId: period.userId,
          type: TransactionType.EXPENSE,
          deletedAt: null,
          occurredAt: {
            gte: periodStart,
            lt: periodEnd,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.transaction.count({
        where: {
          userId: period.userId,
          deletedAt: null,
          occurredAt: {
            gte: periodStart,
            lt: periodEnd,
          },
        },
      }),
    ]);

    return new DashboardTransactionTotalsEntity(
      new Prisma.Decimal(income._sum.amount ?? 0).toFixed(2),
      new Prisma.Decimal(expense._sum.amount ?? 0).toFixed(2),
      transactionCount,
    );
  }

  async getPendingRecurrenceTotals(
    period: DashboardPeriod,
  ): Promise<DashboardRecurrenceTotalsEntity> {
    const { periodStart, periodEnd } = this.getPeriodRange(period);
    const [recurrences, paidPayables] = await Promise.all([
      this.prisma.recurrence.findMany({
        where: {
          userId: period.userId,
          status: RecurrenceStatus.ACTIVE,
          deletedAt: null,
          startDate: { lt: periodEnd },
          OR: [{ endDate: null }, { endDate: { gte: periodStart } }],
        },
        select: {
          id: true,
          amount: true,
          type: true,
          frequency: true,
          startDate: true,
          lastProcessedAt: true,
        },
      }),
      this.prisma.payable.findMany({
        where: {
          userId: period.userId,
          competenceMonth: period.month,
          competenceYear: period.year,
          status: 'PAID',
          recurrenceId: { not: null },
          deletedAt: null,
        },
        select: { recurrenceId: true },
      }),
    ]);
    const paidRecurrenceIds = new Set(paidPayables.map((item) => item.recurrenceId));
    const due = recurrences.filter(
      (item) =>
        (item.frequency !== RecurrenceFrequency.YEARLY ||
          item.startDate.getUTCMonth() === period.month - 1) &&
        (item.type === TransactionType.EXPENSE
          ? !paidRecurrenceIds.has(item.id)
          : !item.lastProcessedAt ||
            item.lastProcessedAt < periodStart ||
            item.lastProcessedAt >= periodEnd),
    );
    const income = due
      .filter((item) => item.type === TransactionType.INCOME)
      .reduce((sum, item) => sum.plus(item.amount), new Prisma.Decimal(0));
    const expense = due
      .filter((item) => item.type === TransactionType.EXPENSE)
      .reduce((sum, item) => sum.plus(item.amount), new Prisma.Decimal(0));

    return new DashboardRecurrenceTotalsEntity(income.toFixed(2), expense.toFixed(2), due.length);
  }

  async getInvestmentContributionTotal(period: DashboardPeriod): Promise<string> {
    const total = await this.prisma.investmentContribution.aggregate({
      where: {
        userId: period.userId,
        month: period.month,
        year: period.year,
        deletedAt: null,
      },
      _sum: { amount: true },
    });

    return new Prisma.Decimal(total._sum.amount ?? 0).toFixed(2);
  }

  async getSpendingByCategory(period: DashboardPeriod): Promise<DashboardCategorySpendingEntity[]> {
    const { periodStart, periodEnd } = this.getPeriodRange(period);
    const totals = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId: period.userId,
        type: TransactionType.EXPENSE,
        deletedAt: null,
        occurredAt: {
          gte: periodStart,
          lt: periodEnd,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });
    const categoryIds = totals
      .map((total) => total.categoryId)
      .filter((categoryId): categoryId is string => Boolean(categoryId));
    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
        userId: period.userId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    });
    const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

    return totals.map(
      (total) =>
        new DashboardCategorySpendingEntity(
          total.categoryId,
          total.categoryId
            ? (categoryNameById.get(total.categoryId) ?? 'Categoria removida')
            : 'Sem categoria',
          new Prisma.Decimal(total._sum.amount ?? 0).toFixed(2),
        ),
    );
  }

  async getGoalsByPeriod(period: DashboardPeriod): Promise<DashboardGoalEntity[]> {
    const goals = await this.prisma.goal.findMany({
      where: {
        userId: period.userId,
        month: period.month,
        year: period.year,
        deletedAt: null,
        category: {
          deletedAt: null,
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        category: {
          name: 'asc',
        },
      },
    });

    return goals.map(
      (goal) =>
        new DashboardGoalEntity(
          goal.id,
          goal.categoryId,
          goal.category.name,
          new Prisma.Decimal(goal.amount).toFixed(2),
        ),
    );
  }

  private getPeriodRange(period: DashboardPeriod): { periodStart: Date; periodEnd: Date } {
    return {
      periodStart: new Date(Date.UTC(period.year, period.month - 1, 1)),
      periodEnd: new Date(Date.UTC(period.year, period.month, 1)),
    };
  }
}
