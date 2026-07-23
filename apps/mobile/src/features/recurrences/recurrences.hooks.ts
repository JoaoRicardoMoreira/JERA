import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/state/query-keys';
import { CreateRecurrenceRequest } from '@/types/bff.models';

import { recurrencesApi } from './recurrences.api';

export function useRecurrences() {
  return useQuery({
    queryKey: queryKeys.recurrences,
    queryFn: recurrencesApi.list,
  });
}

export function useCreateRecurrence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRecurrenceRequest) => recurrencesApi.create(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.recurrences }),
  });
}

export function useDeleteRecurrence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recurrencesApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.recurrences }),
  });
}

export function useProcessRecurrences(month: number, year: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => recurrencesApi.process(month, year),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.recurrences }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(month, year) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions(month, year) }),
      ]);
    },
  });
}
