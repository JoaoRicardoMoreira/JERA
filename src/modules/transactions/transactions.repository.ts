import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType as PrismaTransactionType } from '@prisma/client';

import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { buildPaginationMeta, normalizePagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma.service';
import { TransactionType } from './entities/transaction-type.enum';
import { TransactionEntity } from './entities/transaction.entity';
import {
  CreateTransactionData,
  TransactionCategoryReference,
  TransactionHistoryFilter,
  TransactionRepository,
  UpdateTransactionData,
} from './interfaces/transaction-repository.interface';
import { TransactionMapper } from './mapper/transaction.mapper';

export interface TransactionExportFilter {
  userId: string;
  month?: number;
  year?: number;
  type?: TransactionType;
}

export type ImportTransactionData = CreateTransactionData;

export function buildTransactionCreateData(
  data: CreateTransactionData,
): Prisma.TransactionUncheckedCreateInput {
  return {
    userId: data.userId,
    categoryId: data.categoryId,
    amount: new Prisma.Decimal(data.amount),
    type: TransactionMapper.toPrismaType(data.type),
    description: data.description,
    occurredAt: data.occurredAt,
  };
}

@Injectable()
export class TransactionsRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransactionData): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.create({
      data: buildTransactionCreateData(data),
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return TransactionMapper.toEntity(transaction);
  }

  async findByIdForUser(userId: string, transactionId: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
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

    return transaction ? TransactionMapper.toEntity(transaction) : null;
  }

  async update(
    userId: string,
    transactionId: string,
    data: UpdateTransactionData,
  ): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.$transaction(async (prisma) => {
      const result = await prisma.transaction.updateMany({
        where: {
          id: transactionId,
          userId,
          deletedAt: null,
        },
        data: {
          categoryId: data.categoryId,
          amount: new Prisma.Decimal(data.amount),
          description: data.description,
          occurredAt: data.occurredAt,
        },
      });

      if (!result.count) {
        return null;
      }

      return prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
    });

    return transaction ? TransactionMapper.toEntity(transaction) : null;
  }

  async createMany(data: ImportTransactionData[]): Promise<number> {
    const result = await this.prisma.$transaction(
      data.map((transaction) =>
        this.prisma.transaction.create({
          data: buildTransactionCreateData(transaction),
        }),
      ),
    );

    return result.length;
  }

  async findHistory(filter: TransactionHistoryFilter): Promise<PaginatedResult<TransactionEntity>> {
    const pagination = normalizePagination(filter);
    const periodStart = new Date(Date.UTC(filter.year, filter.month - 1, 1));
    const periodEnd = new Date(Date.UTC(filter.year, filter.month, 1));
    const where = {
      userId: filter.userId,
      deletedAt: null,
      occurredAt: {
        gte: periodStart,
        lt: periodEnd,
      },
      ...(filter.type ? { type: TransactionMapper.toPrismaType(filter.type) } : {}),
    };

    const [transactions, totalItems] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      items: transactions.map(TransactionMapper.toEntity),
      meta: buildPaginationMeta(totalItems, pagination),
    };
  }

  async findForExport(filter: TransactionExportFilter): Promise<TransactionEntity[]> {
    const where = {
      userId: filter.userId,
      deletedAt: null,
      ...(filter.type ? { type: TransactionMapper.toPrismaType(filter.type) } : {}),
      ...this.buildOptionalPeriodFilter(filter),
    };

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ occurredAt: 'asc' }, { createdAt: 'asc' }],
    });

    return transactions.map(TransactionMapper.toEntity);
  }

  async softDelete(userId: string, transactionId: string): Promise<boolean> {
    const result = await this.prisma.transaction.updateMany({
      where: {
        id: transactionId,
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
  ): Promise<TransactionCategoryReference | null> {
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
      type: TransactionMapper.toDomainType(category.type as PrismaTransactionType),
    };
  }

  private buildOptionalPeriodFilter(filter: TransactionExportFilter): {
    occurredAt?: { gte: Date; lt: Date };
  } {
    if (!filter.month || !filter.year) {
      return {};
    }

    return {
      occurredAt: {
        gte: new Date(Date.UTC(filter.year, filter.month - 1, 1)),
        lt: new Date(Date.UTC(filter.year, filter.month, 1)),
      },
    };
  }
}
