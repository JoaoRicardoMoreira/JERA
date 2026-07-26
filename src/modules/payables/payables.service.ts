import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  Payable,
  PayableOrigin,
  PayableStatus,
  Prisma,
  RecurrenceFrequency,
  RecurrenceStatus,
  TransactionType,
} from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import {
  CreatePayableDto,
  PayableGenerationResponseDto,
  PayableQueryDto,
  PayableResponseDto,
} from './dto/payable.dto';

type PayableWithCategory = Payable & { category: { name: string } | null };

@Injectable()
export class PayablesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, query: PayableQueryDto): Promise<PayableResponseDto[]> {
    await this.generateForPeriod(userId, query);
    const rows = await this.prisma.payable.findMany({
      where: {
        userId,
        competenceMonth: query.month,
        competenceYear: query.year,
        deletedAt: null,
        status: { not: PayableStatus.CANCELLED },
      },
      include: { category: { select: { name: true } } },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map((row) => this.toResponse(row));
  }

  async create(userId: string, dto: CreatePayableDto): Promise<PayableResponseDto> {
    const dueDate = new Date(dto.dueDate);
    if (dueDate.getUTCMonth() + 1 !== dto.month || dueDate.getUTCFullYear() !== dto.year) {
      throw new BadRequestException('O vencimento deve pertencer a competencia informada.');
    }
    const amount = new Prisma.Decimal(dto.amount);
    if (!amount.greaterThan(0)) throw new BadRequestException('O valor deve ser maior que zero.');
    if (dto.categoryId) await this.ensureExpenseCategory(userId, dto.categoryId);

    const row = await this.prisma.payable.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        description: dto.description.trim(),
        amount,
        competenceMonth: dto.month,
        competenceYear: dto.year,
        dueDate,
        origin: PayableOrigin.MANUAL,
      },
      include: { category: { select: { name: true } } },
    });
    return this.toResponse(row);
  }

  async generateForPeriod(
    userId: string,
    query: PayableQueryDto,
  ): Promise<PayableGenerationResponseDto> {
    const start = new Date(Date.UTC(query.year, query.month - 1, 1));
    const end = new Date(Date.UTC(query.year, query.month, 1));
    const recurrences = await this.prisma.recurrence.findMany({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        status: RecurrenceStatus.ACTIVE,
        deletedAt: null,
        startDate: { lt: end },
        OR: [{ endDate: null }, { endDate: { gte: start } }],
      },
    });
    const due = recurrences.filter(
      (item) =>
        item.frequency !== RecurrenceFrequency.YEARLY ||
        item.startDate.getUTCMonth() + 1 === query.month,
    );
    let generatedCount = 0;
    for (const recurrence of due) {
      const day = Math.min(
        recurrence.startDate.getUTCDate(),
        new Date(Date.UTC(query.year, query.month, 0)).getUTCDate(),
      );
      const result = await this.prisma.payable.createMany({
        data: [
          {
            userId,
            recurrenceId: recurrence.id,
            categoryId: recurrence.categoryId,
            description: recurrence.description?.trim() || 'Despesa recorrente',
            amount: recurrence.amount,
            competenceMonth: query.month,
            competenceYear: query.year,
            dueDate: new Date(Date.UTC(query.year, query.month - 1, day, 12)),
            origin: PayableOrigin.RECURRENCE,
          },
        ],
        skipDuplicates: true,
      });
      generatedCount += result.count;
    }
    return { generatedCount };
  }

  async markPaid(userId: string, id: string): Promise<PayableResponseDto> {
    const row = await this.prisma.$transaction(async (tx) => {
      const payable = await tx.payable.findFirst({
        where: { id, userId, deletedAt: null },
      });
      if (!payable) throw new NotFoundException('Conta a pagar nao encontrada.');
      if (payable.status === PayableStatus.PAID && payable.transactionId) {
        return tx.payable.findUniqueOrThrow({
          where: { id },
          include: { category: { select: { name: true } } },
        });
      }
      if (payable.status === PayableStatus.CANCELLED) {
        throw new BadRequestException('Uma conta cancelada nao pode ser paga.');
      }
      const transaction = await tx.transaction.create({
        data: {
          userId,
          categoryId: payable.categoryId,
          amount: payable.amount,
          type: TransactionType.EXPENSE,
          description: payable.description,
          occurredAt: payable.dueDate,
        },
      });
      return tx.payable.update({
        where: { id },
        data: {
          status: PayableStatus.PAID,
          paidAt: new Date(),
          transactionId: transaction.id,
        },
        include: { category: { select: { name: true } } },
      });
    });
    return this.toResponse(row);
  }

  private async ensureExpenseCategory(userId: string, categoryId: string): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, userId, type: TransactionType.EXPENSE, deletedAt: null },
    });
    if (!category) throw new BadRequestException('Categoria de despesa invalida.');
  }

  private toResponse(row: PayableWithCategory): PayableResponseDto {
    const today = new Date();
    const due = new Date(row.dueDate);
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
    return {
      id: row.id,
      recurrenceId: row.recurrenceId,
      transactionId: row.transactionId,
      categoryId: row.categoryId,
      categoryName: row.category?.name ?? null,
      description: row.description,
      amount: new Prisma.Decimal(row.amount).toFixed(2),
      competenceMonth: row.competenceMonth,
      competenceYear: row.competenceYear,
      dueDate: row.dueDate.toISOString(),
      status: row.status === PayableStatus.PENDING && daysUntilDue < 0 ? 'OVERDUE' : row.status,
      origin: row.origin,
      paidAt: row.paidAt?.toISOString() ?? null,
      daysUntilDue,
    };
  }
}
