import { TransactionType } from '@prisma/client';

import { GoalEntity } from '../entities/goal.entity';

export const GOALS_REPOSITORY = Symbol('GOALS_REPOSITORY');

export interface UpsertGoalData {
  userId: string;
  categoryId: string;
  amount: string;
  month: number;
  year: number;
}

export interface GoalPeriodFilter {
  userId: string;
  month: number;
  year: number;
}

export interface GoalCategoryReference {
  id: string;
  type: TransactionType;
}

export interface GoalRepository {
  upsert(data: UpsertGoalData): Promise<GoalEntity>;
  findByPeriod(filter: GoalPeriodFilter): Promise<GoalEntity[]>;
  findCategoryForUser(userId: string, categoryId: string): Promise<GoalCategoryReference | null>;
  sumExpensesByCategoryForPeriod(filter: GoalPeriodFilter): Promise<Map<string, string>>;
}
