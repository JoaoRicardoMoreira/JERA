export type TransactionType = 'INCOME' | 'EXPENSE';
export type RecurrenceFrequency = 'MONTHLY';
export type RecurrenceStatus = 'ACTIVE' | 'INACTIVE';

export interface CategoryResponse {
  id: string;
  name: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  amount: string;
  categoryId?: string;
  description?: string;
  occurredAt: string;
}

export type CreateExpenseRequest = CreateTransactionRequest;
export type CreateIncomeRequest = CreateTransactionRequest;

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

export interface DashboardQuery {
  month: number;
  year: number;
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

export interface UpsertGoalRequest {
  categoryId: string;
  amount: string;
  month: number;
  year: number;
}

export interface GoalResponse {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: string;
  spentAmount: string;
  remainingAmount: string;
  progressPercentage: number;
  isExceeded: boolean;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecurrenceRequest {
  amount: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  categoryId?: string;
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

export interface ProcessRecurrencesRequest {
  month: number;
  year: number;
}

export interface ProcessRecurrencesResponse {
  month: number;
  year: number;
  processedCount: number;
  skippedCount: number;
  createdTransactionIds: string[];
}

export interface ExportCsvQuery {
  month?: number;
  year?: number;
  type?: TransactionType;
}

export interface ImportCsvResponse {
  importedCount: number;
}

export interface InvestmentConfigResponse {
  id: string;
  taxaMensalPercent: string;
  createdAt: string;
  updatedAt: string;
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

export interface InvestmentOverviewResponse {
  config: InvestmentConfigResponse;
  contributions: InvestmentContributionResponse[];
  currentContribution: InvestmentContributionResponse | null;
  timeline: InvestmentTimelinePointResponse[];
  totalAportado: string;
  patrimonioFinal: string;
  annualEquivalentPercent: number;
}

export interface InvestmentOverviewQuery {
  month: number;
  year: number;
}

export interface UpsertInvestmentConfigRequest {
  taxaMensalPercent: string;
}

export interface UpsertInvestmentContributionRequest {
  amount: string;
  month: number;
  year: number;
}
