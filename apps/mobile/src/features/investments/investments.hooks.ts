import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toDecimalString } from '@/lib/money/format';
import { queryKeys } from '@/state/query-keys';

import { investmentsApi } from './investments.api';

export function useInvestments(month: number, year: number) {
  return useQuery({
    queryKey: queryKeys.investments(month, year),
    queryFn: () => investmentsApi.overview(month, year),
  });
}

export function useUpdateInvestmentConfig(month: number, year: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taxa: number | string) => investmentsApi.updateConfig(toDecimalString(taxa, 4)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.investments(month, year) }),
  });
}

export function useUpsertInvestmentContribution(month: number, year: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number | string) =>
      investmentsApi.upsertContribution(toDecimalString(amount), month, year),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.investments(month, year) }),
  });
}

export function useDeleteInvestmentContribution(month: number, year: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: investmentsApi.deleteContribution,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.investments(month, year) }),
  });
}
