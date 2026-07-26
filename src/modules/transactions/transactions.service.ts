import { Inject, Injectable } from '@nestjs/common';

import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionType } from './entities/transaction-type.enum';
import {
  TRANSACTIONS_REPOSITORY,
  TransactionRepository,
} from './interfaces/transaction-repository.interface';
import {
  ImportTransactionInput,
  TransactionExportQuery,
  TransactionService,
} from './interfaces/transaction-service.interface';
import { TransactionMapper } from './mapper/transaction.mapper';
import { ImportTransactionData, TransactionExportFilter } from './transactions.repository';
import { TransactionValidator } from './validators/transaction.validator';

interface TransactionCsvRepository {
  createMany(data: ImportTransactionData[]): Promise<number>;
  findForExport(filter: TransactionExportFilter): Promise<TransactionEntity[]>;
}

@Injectable()
export class TransactionsService implements TransactionService {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionsRepository: TransactionRepository & TransactionCsvRepository,
    private readonly transactionValidator: TransactionValidator,
  ) {}

  async createExpense(userId: string, dto: CreateExpenseDto): Promise<TransactionResponseDto> {
    return this.createTransaction(userId, dto, TransactionType.EXPENSE);
  }

  async createIncome(userId: string, dto: CreateIncomeDto): Promise<TransactionResponseDto> {
    return this.createTransaction(userId, dto, TransactionType.INCOME);
  }

  async getHistory(
    userId: string,
    query: TransactionQueryDto,
  ): Promise<PaginatedResult<TransactionResponseDto>> {
    const result = await this.transactionsRepository.findHistory({
      userId,
      month: query.month,
      year: query.year,
      type: query.type,
      page: query.page,
      limit: query.limit,
    });

    return {
      items: result.items.map(TransactionMapper.toResponse),
      meta: result.meta,
    };
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const existingTransaction = this.transactionValidator.ensureTransactionFound(
      await this.transactionsRepository.findByIdForUser(userId, transactionId),
    );

    if (dto.categoryId) {
      const category = await this.transactionsRepository.findCategoryForUser(
        userId,
        dto.categoryId,
      );

      this.transactionValidator.ensureCategoryMatchesTransactionType(
        category,
        existingTransaction.type,
      );
    }

    const updatedTransaction = this.transactionValidator.ensureTransactionFound(
      await this.transactionsRepository.update(userId, transactionId, {
        categoryId: dto.categoryId ?? null,
        amount: dto.amount,
        description: this.normalizeDescription(dto.description),
        occurredAt: new Date(dto.occurredAt),
      }),
    );

    return TransactionMapper.toResponse(updatedTransaction);
  }

  async getTransactionsForExport(
    userId: string,
    query: TransactionExportQuery,
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionsRepository.findForExport({
      userId,
      month: query.month,
      year: query.year,
      type: query.type,
    });

    return transactions.map(TransactionMapper.toResponse);
  }

  async importTransactions(userId: string, rows: ImportTransactionInput[]): Promise<number> {
    await this.validateImportRows(userId, rows);

    const data: ImportTransactionData[] = rows.map((row) => ({
      userId,
      categoryId: row.categoryId,
      amount: row.amount,
      type: row.type,
      description: this.normalizeDescription(row.description),
      occurredAt: new Date(row.occurredAt),
    }));

    return this.transactionsRepository.createMany(data);
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    const wasDeleted = await this.transactionsRepository.softDelete(userId, transactionId);

    this.transactionValidator.ensureTransactionDeleted(wasDeleted);
  }

  private async createTransaction(
    userId: string,
    dto: CreateExpenseDto | CreateIncomeDto,
    type: TransactionType,
  ): Promise<TransactionResponseDto> {
    const categoryId = dto.categoryId;

    if (categoryId) {
      const category = await this.transactionsRepository.findCategoryForUser(userId, categoryId);

      this.transactionValidator.ensureCategoryMatchesTransactionType(category, type);
    }

    const transaction = await this.transactionsRepository.create({
      userId,
      categoryId,
      amount: dto.amount,
      type,
      description: this.normalizeDescription(dto.description),
      occurredAt: new Date(dto.occurredAt),
    });

    return TransactionMapper.toResponse(transaction);
  }

  private normalizeDescription(description?: string): string | undefined {
    const normalized = description?.trim().replace(/\s+/g, ' ');

    return normalized || undefined;
  }

  private async validateImportRows(userId: string, rows: ImportTransactionInput[]): Promise<void> {
    for (const row of rows) {
      if (!row.categoryId) {
        continue;
      }

      const category = await this.transactionsRepository.findCategoryForUser(
        userId,
        row.categoryId,
      );

      this.transactionValidator.ensureCategoryMatchesTransactionType(category, row.type);
    }
  }
}
