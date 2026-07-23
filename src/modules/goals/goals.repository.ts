import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { GoalEntity } from './entities/goal.entity';
import {
  GoalCategoryReference,
  GoalPeriodFilter,
  GoalRepository,
  UpsertGoalData,
} from './interfaces/goal-repository.interface';
import { GoalMapper } from './mapper/goal.mapper';

@Injectable()
export class GoalsRepository implements GoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(data: UpsertGoalData): Promise<GoalEntity> {
    const goal = await this.prisma.goal.upsert({
      where: {
        userId_categoryId_month_year: {
          userId: data.userId,
          categoryId: data.categoryId,
          month: data.month,
          year: data.year,
        },
      },
      create: {
        userId: data.userId,
        categoryId: data.categoryId,
        amount: new Prisma.Decimal(data.amount),
        month: data.month,
        year: data.year,
      },
      update: {
        amount: new Prisma.Decimal(data.amount),
        deletedAt: null,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return GoalMapper.toEntity(goal);
  }

  async findByPeriod(filter: GoalPeriodFilter): Promise<GoalEntity[]> {
    const goals = await this.prisma.goal.findMany({
      where: {
        userId: filter.userId,
        month: filter.month,
        year: filter.year,
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

    return goals.map(GoalMapper.toEntity);
  }

  async findCategoryForUser(
    userId: string,
    categoryId: string,
  ): Promise<GoalCategoryReference | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        type: true,
      },
    });

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      type: category.type,
    };
  }

  async sumExpensesByCategoryForPeriod(filter: GoalPeriodFilter): Promise<Map<string, string>> {
    const periodStart = new Date(Date.UTC(filter.year, filter.month - 1, 1));
    const periodEnd = new Date(Date.UTC(filter.year, filter.month, 1));
    const totals = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId: filter.userId,
        type: TransactionType.EXPENSE,
        deletedAt: null,
        categoryId: {
          not: null,
        },
        occurredAt: {
          gte: periodStart,
          lt: periodEnd,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return new Map(
      totals
        .filter((total) => total.categoryId)
        .map((total) => [
          total.categoryId as string,
          new Prisma.Decimal(total._sum.amount ?? 0).toFixed(2),
        ]),
    );
  }
}
