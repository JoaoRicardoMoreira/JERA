export type TransactionType = 'INCOME' | 'EXPENSE';
export type RecurrenceFrequency = 'MONTHLY';
export type RecurrenceStatus = 'ACTIVE' | 'INACTIVE';
export type UserRole = 'USER' | 'ADMIN';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: unknown;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  permissions: string[];
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  amount: string;
  categoryId?: string | null;
  description?: string;
  occurredAt: string;
}

export interface TransactionHistoryQuery {
  month: number;
  year: number;
  type?: TransactionType;
  page?: number;
  limit?: number;
}

export interface TransactionResponse {
  id: string;
  amount: string;
  type: TransactionType;
  categoryId: string | null;
  categoryName: string | null;
  description: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySummaryResponse {
  month: number;
  year: number;
  totalIncome: string;
  totalExpense: string;
  balance: string;
  transactionCount: number;
  goals: GoalSummaryResponse;
}

export interface GoalSummaryResponse {
  totalGoalAmount: string;
  totalGoalSpentAmount: string;
  totalGoalRemainingAmount: string;
  progressPercentage: number;
  hasExceededGoals: boolean;
}

export interface ChartsResponse {
  month: number;
  year: number;
  spendingByCategory: CategorySpendingChartItemResponse[];
  goalsByCategory: GoalChartItemResponse[];
}

export interface CategorySpendingChartItemResponse {
  categoryId: string | null;
  categoryName: string;
  amount: string;
  percentage: number;
}

export interface GoalChartItemResponse {
  categoryId: string;
  categoryName: string;
  goalAmount: string;
  spentAmount: string;
  remainingAmount: string;
  progressPercentage: number;
  isExceeded: boolean;
}

export interface CreateRecurrenceRequest {
  amount: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  categoryId?: string | null;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface RecurrenceResponse {
  id: string;
  amount: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  status: RecurrenceStatus;
  categoryId: string | null;
  categoryName: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  lastProcessedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessRecurrencesResponse {
  month: number;
  year: number;
  processedCount: number;
  skippedCount: number;
  createdTransactionIds: string[];
}

export interface InvestmentOverviewResponse {
  config: { id: string; taxaMensalPercent: string; createdAt: string; updatedAt: string };
  contributions: InvestmentContributionResponse[];
  currentContribution: InvestmentContributionResponse | null;
  timeline: InvestmentTimelinePointResponse[];
  totalAportado: string;
  patrimonioFinal: string;
  annualEquivalentPercent: number;
}

export interface InvestmentContributionResponse {
  id: string;
  amount: string;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentTimelinePointResponse {
  key: string;
  year: number;
  month: number;
  label: string;
  aporte: string;
  patrimonio: string;
}
