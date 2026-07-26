export type TransactionType = 'INCOME' | 'EXPENSE';
export type Gender = 'FEMALE' | 'MALE' | 'NON_BINARY' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate: string | null;
  age: number | null;
  gender: Gender | null;
  phone: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}
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
  totalGoalContribution: string;
  balance: string;
  transactionCount: number;
  goals: { totalGoalAmount: string; progressPercentage: number };
}
export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: string;
  spentAmount: string;
  remainingAmount: string;
  progressPercentage: number;
  isExceeded: boolean;
}
export type FinancialGoalCategory = 'HOME' | 'TRAVEL' | 'CAR' | 'EMERGENCY_RESERVE' | 'OTHER';
export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  remainingAmount: string;
  progressPercentage: number;
  targetDate: string | null;
  estimatedCompletion: string | null;
  icon: string | null;
  category: FinancialGoalCategory;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}
export interface FinancialGoalContribution {
  id: string;
  financialGoalId: string;
  amount: string;
  contributedAt: string;
  createdAt: string;
}
export interface Payable {
  id: string;
  recurrenceId: string | null;
  transactionId: string | null;
  categoryId: string | null;
  categoryName: string | null;
  description: string;
  amount: string;
  competenceMonth: number;
  competenceYear: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'OVERDUE';
  origin: 'MANUAL' | 'RECURRENCE';
  paidAt: string | null;
  daysUntilDue: number;
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
  goalsByCategory: Budget[];
}
export interface InvestmentContribution {
  id: string;
  amount: string;
  contributedAt: string;
  month: number;
  year: number;
  selicAnnualRatePercent: string | null;
  selicReferenceDate: string | null;
  monthlyEquivalentRatePercent: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface InvestmentOverview {
  config: { taxaMensalPercent: string };
  contributions: InvestmentContribution[];
  currentContribution: InvestmentContribution | null;
  timeline: { key: string; label: string; aporte: string; patrimonio: string }[];
  totalAportado: string;
  patrimonioFinal: string;
  annualEquivalentPercent: number;
}
export interface FinanceData {
  categories: Category[];
  transactions: Transaction[];
  summary: Summary;
  budgets: Budget[];
  financialGoals: FinancialGoal[];
  payables: Payable[];
  recurrences: Recurrence[];
  charts: Charts;
  investment: InvestmentOverview | null;
  previousSummary: Summary | null;
}
