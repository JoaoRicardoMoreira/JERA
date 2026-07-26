import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FinancialGoal, FinancialGoalCategory, FinancialGoalStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import {
  CreateFinancialGoalDto,
  FinancialGoalResponseDto,
  UpdateFinancialGoalDto,
} from './dto/financial-goal.dto';

@Injectable()
export class FinancialGoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<FinancialGoalResponseDto[]> {
    const goals = await this.prisma.financialGoal.findMany({
      where: { userId, deletedAt: null, status: { not: FinancialGoalStatus.CANCELLED } },
      orderBy: [{ status: 'asc' }, { targetDate: 'asc' }, { createdAt: 'asc' }],
    });
    return goals.map((goal) => this.toResponse(goal));
  }

  async create(userId: string, dto: CreateFinancialGoalDto): Promise<FinancialGoalResponseDto> {
    const targetAmount = this.positive(dto.targetAmount, 'O valor alvo deve ser maior que zero.');
    const currentAmount = this.nonNegative(
      dto.currentAmount ?? '0',
      'O valor acumulado nao pode ser negativo.',
    );
    const goal = await this.prisma.financialGoal.create({
      data: {
        userId,
        name: dto.name.trim(),
        targetAmount,
        currentAmount,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        icon: dto.icon?.trim() || undefined,
        category: dto.category ?? FinancialGoalCategory.OTHER,
        status: currentAmount.greaterThanOrEqualTo(targetAmount)
          ? FinancialGoalStatus.COMPLETED
          : FinancialGoalStatus.ACTIVE,
      },
    });
    return this.toResponse(goal);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateFinancialGoalDto,
  ): Promise<FinancialGoalResponseDto> {
    const current = await this.prisma.financialGoal.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!current) throw new NotFoundException('Meta financeira nao encontrada.');

    const targetAmount = dto.targetAmount
      ? this.positive(dto.targetAmount, 'O valor alvo deve ser maior que zero.')
      : current.targetAmount;
    const currentAmount = dto.currentAmount
      ? this.nonNegative(dto.currentAmount, 'O valor acumulado nao pode ser negativo.')
      : current.currentAmount;
    const computedStatus =
      dto.status ??
      (currentAmount.greaterThanOrEqualTo(targetAmount)
        ? FinancialGoalStatus.COMPLETED
        : FinancialGoalStatus.ACTIVE);
    const goal = await this.prisma.financialGoal.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        targetAmount,
        currentAmount,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        icon: dto.icon?.trim(),
        category: dto.category,
        status: computedStatus,
      },
    });
    return this.toResponse(goal);
  }

  async remove(userId: string, id: string): Promise<void> {
    const result = await this.prisma.financialGoal.updateMany({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (!result.count) throw new NotFoundException('Meta financeira nao encontrada.');
  }

  private toResponse(goal: FinancialGoal): FinancialGoalResponseDto {
    const target = new Prisma.Decimal(goal.targetAmount);
    const current = new Prisma.Decimal(goal.currentAmount);
    const remaining = Prisma.Decimal.max(target.minus(current), 0);
    const progress = target.isZero()
      ? 0
      : Math.min(current.dividedBy(target).times(100).toDecimalPlaces(2).toNumber(), 100);
    return {
      id: goal.id,
      name: goal.name,
      targetAmount: target.toFixed(2),
      currentAmount: current.toFixed(2),
      remainingAmount: remaining.toFixed(2),
      progressPercentage: progress,
      targetDate: goal.targetDate?.toISOString() ?? null,
      estimatedCompletion: goal.targetDate?.toISOString() ?? null,
      icon: goal.icon,
      category: goal.category,
      status: goal.status,
    };
  }

  private positive(value: string, message: string): Prisma.Decimal {
    const amount = new Prisma.Decimal(value);
    if (!amount.greaterThan(0)) throw new BadRequestException(message);
    return amount;
  }

  private nonNegative(value: string, message: string): Prisma.Decimal {
    const amount = new Prisma.Decimal(value);
    if (amount.lessThan(0)) throw new BadRequestException(message);
    return amount;
  }
}
