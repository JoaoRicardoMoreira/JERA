import { Goal, Prisma } from '@prisma/client';

import { GoalResponseDto } from '../dto/goal-response.dto';
import { GoalEntity } from '../entities/goal.entity';

type PrismaGoal = Pick<
  Goal,
  | 'id'
  | 'userId'
  | 'categoryId'
  | 'amount'
  | 'month'
  | 'year'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
  category: {
    name: string;
  };
};

export interface GoalProgress {
  spentAmount: string;
  remainingAmount: string;
  progressPercentage: number;
  isExceeded: boolean;
}

export class GoalMapper {
  static toEntity(goal: PrismaGoal): GoalEntity {
    return new GoalEntity(
      goal.id,
      goal.userId,
      goal.categoryId,
      goal.category.name,
      new Prisma.Decimal(goal.amount).toFixed(2),
      goal.month,
      goal.year,
      goal.createdAt,
      goal.updatedAt,
      goal.deletedAt,
    );
  }

  static toResponse(goal: GoalEntity, progress: GoalProgress): GoalResponseDto {
    return {
      id: goal.id,
      categoryId: goal.categoryId,
      categoryName: goal.categoryName,
      amount: goal.amount,
      spentAmount: progress.spentAmount,
      remainingAmount: progress.remainingAmount,
      progressPercentage: progress.progressPercentage,
      isExceeded: progress.isExceeded,
      month: goal.month,
      year: goal.year,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
    };
  }
}
