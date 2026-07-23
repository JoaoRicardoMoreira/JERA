'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, decimal } from '@/lib/api';
import type { FinanceData, TransactionType } from '@/lib/types';

const empty: FinanceData = {
  categories: [],
  transactions: [],
  summary: {
    totalIncome: '0',
    totalExpense: '0',
    totalInvestment: '0',
    balance: '0',
    transactionCount: 0,
    goals: { totalGoalAmount: '0', progressPercentage: 0 },
  },
  goals: [],
  recurrences: [],
  charts: { spendingByCategory: [], goalsByCategory: [] },
};
type Context = {
  data: FinanceData;
  month: number;
  year: number;
  loading: boolean;
  error: string;
  setPeriod(m: number, y: number): void;
  refresh(): Promise<void>;
  createTransaction(type: TransactionType, input: FormInput): Promise<void>;
  createRecurrence(input: FormInput & { type: TransactionType; day: number }): Promise<void>;
  remove(path: string): Promise<void>;
  processRecurrences(): Promise<void>;
  upsertGoal(categoryId: string, value: number): Promise<void>;
};
export type FormInput = {
  description: string;
  amount: number;
  categoryId?: string;
  occurredAt?: string;
};
const FinanceContext = createContext<Context | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    const q = `month=${month}&year=${year}`;
    try {
      const [categories, history, summary, charts, goals, recurrences] = await Promise.all([
        api<FinanceData['categories']>('/categories'),
        api<{ items: FinanceData['transactions'] }>(`/transactions/history?${q}&limit=100`),
        api<FinanceData['summary']>(`/dashboard/monthly-summary?${q}`),
        api<FinanceData['charts']>(`/dashboard/charts?${q}`),
        api<FinanceData['goals']>(`/goals?${q}`),
        api<FinanceData['recurrences']>('/recurrences'),
      ]);
      setData({ categories, transactions: history.items, summary, charts, goals, recurrences });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [month, year]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  async function mutate(work: () => Promise<unknown>) {
    setLoading(true);
    setError('');
    try {
      await work();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.');
      setLoading(false);
      throw e;
    }
  }
  const value = useMemo<Context>(
    () => ({
      data,
      month,
      year,
      loading,
      error,
      setPeriod(m, y) {
        setMonth(m);
        setYear(y);
      },
      refresh,
      createTransaction: (type, v) =>
        mutate(() =>
          api(`/transactions/${type === 'INCOME' ? 'income' : 'expense'}`, {
            method: 'POST',
            body: JSON.stringify({
              amount: decimal(v.amount),
              categoryId: v.categoryId || undefined,
              description: v.description,
              occurredAt: `${v.occurredAt || new Date().toISOString().slice(0, 10)}T12:00:00.000Z`,
            }),
          }),
        ),
      createRecurrence: (v) =>
        mutate(() =>
          api('/recurrences', {
            method: 'POST',
            body: JSON.stringify({
              amount: decimal(v.amount),
              type: v.type,
              frequency: 'MONTHLY',
              categoryId: v.categoryId || undefined,
              description: v.description,
              startDate: `${year}-${String(month).padStart(2, '0')}-${String(v.day).padStart(2, '0')}T12:00:00.000Z`,
            }),
          }),
        ),
      remove: (path) => mutate(() => api(path, { method: 'DELETE' })),
      processRecurrences: () =>
        mutate(() =>
          api('/recurrences/process', { method: 'POST', body: JSON.stringify({ month, year }) }),
        ),
      upsertGoal: (categoryId, amount) =>
        mutate(() =>
          api('/goals', {
            method: 'PUT',
            body: JSON.stringify({ categoryId, amount: decimal(amount), month, year }),
          }),
        ),
    }),
    [data, month, year, loading, error, refresh],
  );
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
export function useFinance() {
  const value = useContext(FinanceContext);
  if (!value) throw new Error('FinanceProvider ausente');
  return value;
}
