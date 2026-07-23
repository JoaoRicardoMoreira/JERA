import {
  PaginatedResult,
  PaginationOptions,
} from '../../../common/interfaces/pagination.interface';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionType } from '../entities/transaction-type.enum';

export const TRANSACTIONS_REPOSITORY = Symbol('TRANSACTIONS_REPOSITORY');

export interface CreateTransactionData {
  userId: string;
  categoryId?: string;
  amount: string;
  type: TransactionType;
  description?: string;
  occurredAt: Date;
}

export interface TransactionHistoryFilter extends PaginationOptions {
  userId: string;
  month: number;
  year: number;
  type?: TransactionType;
}

export interface TransactionCategoryReference {
  id: string;
  type: TransactionType;
}

export interface TransactionRepository {
  create(data: CreateTransactionData): Promise<TransactionEntity>;
  findHistory(filter: TransactionHistoryFilter): Promise<PaginatedResult<TransactionEntity>>;
  softDelete(userId: string, transactionId: string): Promise<boolean>;
  findCategoryForUser(
    userId: string,
    categoryId: string,
  ): Promise<TransactionCategoryReference | null>;
}
