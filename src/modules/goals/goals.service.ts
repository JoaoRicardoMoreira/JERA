import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { GoalQueryDto } from './dto/goal-query.dto';
import { GoalResponseDto } from './dto/goal-response.dto';
import { UpsertGoalDto } from './dto/upsert-goal.dto';
import { GoalEntity } from './entities/goal.entity';
import { GOALS_REPOSITORY, GoalRepository } from './interfaces/goal-repository.interface';
import { GoalService } from './interfaces/goal-service.interface';
import { GoalMapper, GoalProgress } from './mapper/goal.mapper';
import { GoalValidator } from './validators/goal.validator';

@Injectable()
export class GoalsService implements GoalService {
  constructor(
    @Inject(GOALS_REPOSITORY)
    private readonly goalsRepository: GoalRepository,
    private readonly goalValidator: GoalValidator,
  ) {}

  async upsertGoal(userId: string, dto: UpsertGoalDto): Promise<GoalResponseDto> {
    const category = await this.goalsRepository.findCategoryForUser(userId, dto.categoryId);

    this.goalValidator.ensureExpenseCategory(category);

    const goal = await this.goalsRepository.upsert({
      userId,
      categoryId: dto.categoryId,
      amount: dto.amount,
      month: dto.month,
      year: dto.year,
    });
    const spendingByCategory = await this.goalsRepository.sumExpensesByCategoryForPeriod({
      userId,
      month: dto.month,
      year: dto.year,
    });

    return GoalMapper.toResponse(goal, this.calculateProgress(goal, spendingByCategory));
  }

  async getGoalsByPeriod(userId: string, query: GoalQueryDto): Promise<GoalResponseDto[]> {
    const [goals, spendingByCategory] = await Promise.all([
      this.goalsRepository.findByPeriod({
        userId,
        month: query.month,
        year: query.year,
      }),
      this.goalsRepository.sumExpensesByCategoryForPeriod({
        userId,
        month: query.month,
        year: query.year,
      }),
    ]);

    return goals.map((goal) =>
      GoalMapper.toResponse(goal, this.calculateProgress(goal, spendingByCategory)),
    );
  }

  private calculateProgress(
    goal: GoalEntity,
    spendingByCategory: Map<string, string>,
  ): GoalProgress {
    const amount = new Prisma.Decimal(goal.amount);
    const spentAmount = new Prisma.Decimal(spendingByCategory.get(goal.categoryId) ?? 0);
    const remainingAmount = Prisma.Decimal.max(amount.minus(spentAmount), 0);
    const progressPercentage = spentAmount
      .dividedBy(amount)
      .times(100)
      .toDecimalPlaces(2)
      .toNumber();

    return {
      spentAmount: spentAmount.toFixed(2),
      remainingAmount: remainingAmount.toFixed(2),
      progressPercentage,
      isExceeded: spentAmount.greaterThan(amount),
    };
  }
}
