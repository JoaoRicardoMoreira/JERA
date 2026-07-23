import { ApiErrorViewModel } from '../../core/api/api-error.model';
import { CategoryResponse, RecurrenceStatus, TransactionType } from './bff.models';

export type UiTransactionKind = 'renda' | 'gasto';

export interface TransactionViewModel {
  id: string;
  desc: string;
  valor: number;
  data: string;
  type: UiTransactionKind;
  bffType: TransactionType;
  categoria?: string;
  categoryId?: string | null;
}

export interface SummaryViewModel {
  totalRenda: number;
  totalGasto: number;
  saldo: number;
  metaGlobal: number;
  transactionCount: number;
  goalProgressPercentage: number;
  hasExceededGoals: boolean;
}

export interface ChartsViewModel {
  categories: string[];
  gastosPorCat: number[];
  metasPorCat: number[];
  spendingPercentages: number[];
}

export interface GoalViewModel {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  spentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  isExceeded: boolean;
}

export interface RecurrenceViewModel {
  id: string;
  type: UiTransactionKind;
  desc: string;
  valor: number;
  dia: number;
  status: RecurrenceStatus;
  categoria?: string;
  categoryId?: string | null;
  lastProcessed?: string;
}

export interface FinanceUiState {
  filters: {
    month: number | 'all';
    year: number;
  };
  categories: CategoryResponse[];
  rendas: TransactionViewModel[];
  gastos: TransactionViewModel[];
  recorrentes: RecurrenceViewModel[];
  goals: GoalViewModel[];
  summary: SummaryViewModel | null;
  charts: ChartsViewModel | null;
  loading: {
    initial: boolean;
    transactions: boolean;
    dashboard: boolean;
    mutation: boolean;
  };
  error: ApiErrorViewModel | null;
}
