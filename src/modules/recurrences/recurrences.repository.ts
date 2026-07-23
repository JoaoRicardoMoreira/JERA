import { Injectable } from '@nestjs/common';
import { Prisma, RecurrenceStatus as PrismaRecurrenceStatus } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { buildTransactionCreateData } from '../transactions/transactions.repository';
import { RecurrenceEntity } from './entities/recurrence.entity';
import {
  CreateRecurrenceData,
  RecurrenceCategoryReference,
  RecurrenceRepository,
} from './interfaces/recurrence-repository.interface';
import { RecurrenceMapper } from './mapper/recurrence.mapper';

export interface ProcessDueRecurrenceData {
  id: string;
  categoryId: string | null;
  amount: string;
  type: RecurrenceEntity['type'];
  description: string | null;
  occurredAt: Date;
}

export interface ProcessDueRecurrencesData {
  userId: string;
  periodStart: Date;
  periodEnd: Date;
  processedAt: Date;
  recurrences: ProcessDueRecurrenceData[];
}

export interface ProcessDueRecurrencesResult {
  processedCount: number;
  skippedCount: number;
  createdTransactionIds: string[];
}

@Injectable()
export class RecurrencesRepository implements RecurrenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRecurrenceData): Promise<RecurrenceEntity> {
    const recurrence = await this.prisma.recurrence.create({
      data: {
        userId: data.userId,
        categoryId: data.categoryId,
        amount: new Prisma.Decimal(data.amount),
        type: RecurrenceMapper.toPrismaType(data.type),
        frequency: data.frequency,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return RecurrenceMapper.toEntity(recurrence);
  }

  async findActiveByUserId(userId: string): Promise<RecurrenceEntity[]> {
    const recurrences = await this.prisma.recurrence.findMany({
      where: {
        userId,
        status: PrismaRecurrenceStatus.ACTIVE,
        deletedAt: null,
        OR: [{ categoryId: null }, { category: { deletedAt: null } }],
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ startDate: 'asc' }, { createdAt: 'asc' }],
    });

    return recurrences.map(RecurrenceMapper.toEntity);
  }

  async softDelete(userId: string, recurrenceId: string): Promise<boolean> {
    const result = await this.prisma.recurrence.updateMany({
      where: {
        id: recurrenceId,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return result.count > 0;
  }

  async findCategoryForUser(
    userId: string,
    categoryId: string,
  ): Promise<RecurrenceCategoryReference | null> {
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
      type: RecurrenceMapper.toDomainType(category.type),
    };
  }

  async processDueRecurrences(
    data: ProcessDueRecurrencesData,
  ): Promise<ProcessDueRecurrencesResult> {
    const createdTransactionIds: string[] = [];
    let skippedCount = 0;

    await this.prisma.$transaction(async (transaction) => {
      for (const recurrence of data.recurrences) {
        const locked = await transaction.recurrence.updateMany({
          where: {
            id: recurrence.id,
            userId: data.userId,
            status: PrismaRecurrenceStatus.ACTIVE,
            deletedAt: null,
            OR: [
              { lastProcessedAt: null },
              { lastProcessedAt: { lt: data.periodStart } },
              { lastProcessedAt: { gte: data.periodEnd } },
            ],
          },
          data: {
            lastProcessedAt: data.processedAt,
          },
        });

        if (locked.count === 0) {
          skippedCount += 1;
          continue;
        }

        const created = await transaction.transaction.create({
          data: buildTransactionCreateData({
            userId: data.userId,
            categoryId: recurrence.categoryId ?? undefined,
            amount: recurrence.amount,
            type: recurrence.type,
            description: recurrence.description ?? undefined,
            occurredAt: recurrence.occurredAt,
          }),
          select: {
            id: true,
          },
        });

        createdTransactionIds.push(created.id);
      }
    });

    return {
      processedCount: createdTransactionIds.length,
      skippedCount,
      createdTransactionIds,
    };
  }
}
