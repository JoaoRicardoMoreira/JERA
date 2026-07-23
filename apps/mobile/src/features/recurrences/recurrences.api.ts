import { apiRequest } from '@/lib/api/client';
import {
  CreateRecurrenceRequest,
  ProcessRecurrencesResponse,
  RecurrenceResponse,
} from '@/types/bff.models';

export const recurrencesApi = {
  list() {
    return apiRequest<RecurrenceResponse[]>('/recurrences');
  },

  create(request: CreateRecurrenceRequest) {
    return apiRequest<RecurrenceResponse>('/recurrences', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  process(month: number, year: number) {
    return apiRequest<ProcessRecurrencesResponse>('/recurrences/process', {
      method: 'POST',
      body: JSON.stringify({ month, year }),
    });
  },

  delete(id: string) {
    return apiRequest<void>(`/recurrences/${id}`, { method: 'DELETE' });
  },
};
