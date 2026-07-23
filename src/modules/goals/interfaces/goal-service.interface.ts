import { GoalQueryDto } from '../dto/goal-query.dto';
import { GoalResponseDto } from '../dto/goal-response.dto';
import { UpsertGoalDto } from '../dto/upsert-goal.dto';

export const GOALS_SERVICE = Symbol('GOALS_SERVICE');

export interface GoalService {
  upsertGoal(userId: string, dto: UpsertGoalDto): Promise<GoalResponseDto>;
  getGoalsByPeriod(userId: string, query: GoalQueryDto): Promise<GoalResponseDto[]>;
}
