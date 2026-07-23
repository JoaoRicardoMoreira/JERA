export type TransactionType = 'INCOME' | 'EXPENSE';
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}
export interface Transaction {
  id: string;
  amount: string;
  type: TransactionType;
  categoryId: string | null;
  categoryName: string | null;
  description: string | null;
  occurredAt: string;
}
export interface Summary {
  totalIncome: string;
  totalExpense: string;
  totalInvestment: string;
  balance: string;
  transactionCount: number;
  goals: { totalGoalAmount: string; progressPercentage: number };
}
export interface Goal {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: string;
  spentAmount: string;
  remainingAmount: string;
  progressPercentage: number;
  isExceeded: boolean;
}
export interface Recurrence {
  id: string;
  amount: string;
  type: TransactionType;
  categoryId: string | null;
  categoryName: string | null;
  description: string | null;
  startDate: string;
  status: string;
}
export interface Charts {
  spendingByCategory: {
    categoryId: string | null;
    categoryName: string;
    amount: string;
    percentage: number;
  }[];
  goalsByCategory: Goal[];
}
export interface InvestmentOverview {
  config: { taxaMensalPercent: string };
  contributions: {
    id: string;
    amount: string;
    contributedAt: string;
    month: number;
    year: number;
  }[];
  timeline: { key: string; label: string; aporte: string; patrimonio: string }[];
  totalAportado: string;
  patrimonioFinal: string;
  annualEquivalentPercent: number;
}
export interface FinanceData {
  categories: Category[];
  transactions: Transaction[];
  summary: Summary;
  goals: Goal[];
  recurrences: Recurrence[];
  charts: Charts;
}
