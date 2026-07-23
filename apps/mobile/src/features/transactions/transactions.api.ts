import { apiRequest } from '@/lib/api/client';
import {
  CreateTransactionRequest,
  PaginatedData,
  TransactionHistoryQuery,
  TransactionResponse,
} from '@/types/bff.models';

export const transactionsApi = {
  history(query: TransactionHistoryQuery) {
    const params = new URLSearchParams({
      month: String(query.month),
      year: String(query.year),
      limit: String(query.limit ?? 100),
      page: String(query.page ?? 1),
    });

    if (query.type) {
      params.set('type', query.type);
    }

    return apiRequest<PaginatedData<TransactionResponse>>(
      `/transactions/history?${params.toString()}`,
    );
  },

  createIncome(request: CreateTransactionRequest) {
    return apiRequest<TransactionResponse>('/transactions/income', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  createExpense(request: CreateTransactionRequest) {
    return apiRequest<TransactionResponse>('/transactions/expense', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  delete(id: string) {
    return apiRequest<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};
