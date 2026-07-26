import { PaginatedResult } from '../../../common/interfaces/pagination.interface';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { TransactionQueryDto } from '../dto/transaction-query.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionType } from '../entities/transaction-type.enum';

export const TRANSACTIONS_SERVICE = Symbol('TRANSACTIONS_SERVICE');

export interface TransactionExportQuery {
  month?: number;
  year?: number;
  type?: TransactionType;
}

export interface ImportTransactionInput {
  amount: string;
  type: TransactionType;
  categoryId?: string;
  description?: string;
  occurredAt: string;
}

export interface TransactionService {
  createExpense(userId: string, dto: CreateExpenseDto): Promise<TransactionResponseDto>;
  createIncome(userId: string, dto: CreateIncomeDto): Promise<TransactionResponseDto>;
  updateTransaction(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto>;
  getHistory(
    userId: string,
    query: TransactionQueryDto,
  ): Promise<PaginatedResult<TransactionResponseDto>>;
  getTransactionsForExport(
    userId: string,
    query: TransactionExportQuery,
  ): Promise<TransactionResponseDto[]>;
  importTransactions(userId: string, rows: ImportTransactionInput[]): Promise<number>;
  deleteTransaction(userId: string, transactionId: string): Promise<void>;
}
