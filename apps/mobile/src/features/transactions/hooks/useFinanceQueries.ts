import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { categoriesApi } from '@/features/categories/categories.api';
import { dashboardApi } from '@/features/dashboard/dashboard.api';
import { transactionsApi } from '@/features/transactions/transactions.api';
import { toTransactionViewModel } from '@/features/transactions/types';
import { queryKeys } from '@/state/query-keys';
import { CreateTransactionRequest, TransactionType } from '@/types/bff.models';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
  });
}

export function useMonthlySummary(month: number, year: number) {
  return useQuery({
    queryKey: queryKeys.dashboard(month, year),
    queryFn: () => dashboardApi.summary(month, year),
  });
}

export function useCharts(month: number, year: number) {
  return useQuery({
    queryKey: queryKeys.charts(month, year),
    queryFn: () => dashboardApi.charts(month, year),
  });
}

export function useTransactions(month: number, year: number, type?: TransactionType) {
  return useQuery({
    queryKey: queryKeys.transactions(month, year, type),
    queryFn: async () => {
      const history = await transactionsApi.history({ month, year, type });
      return history.items.map(toTransactionViewModel);
    },
  });
}

export function useCreateTransaction(month: number, year: number, type: TransactionType) {
  const queryClient = useQueryClient();
  const mutationFn =
    type === 'INCOME' ? transactionsApi.createIncome : transactionsApi.createExpense;

  return useMutation({
    mutationFn: (request: CreateTransactionRequest) => mutationFn(request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(month, year) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.charts(month, year) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions(month, year, type) }),
      ]);
    },
  });
}

export function useDeleteTransaction(month: number, year: number, type: TransactionType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(month, year) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.charts(month, year) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions(month, year, type) }),
      ]);
    },
  });
}
