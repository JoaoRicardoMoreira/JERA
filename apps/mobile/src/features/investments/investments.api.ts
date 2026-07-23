import { apiRequest } from '@/lib/api/client';
import { InvestmentContributionResponse, InvestmentOverviewResponse } from '@/types/bff.models';

export const investmentsApi = {
  overview(month: number, year: number) {
    return apiRequest<InvestmentOverviewResponse>(
      `/investments/overview?month=${month}&year=${year}`,
    );
  },

  updateConfig(taxaMensalPercent: string) {
    return apiRequest<InvestmentOverviewResponse>('/investments/config', {
      method: 'PUT',
      body: JSON.stringify({ taxaMensalPercent }),
    });
  },

  upsertContribution(amount: string, month: number, year: number) {
    return apiRequest<InvestmentContributionResponse>('/investments/contributions', {
      method: 'PUT',
      body: JSON.stringify({ amount, month, year }),
    });
  },

  deleteContribution(id: string) {
    return apiRequest<void>(`/investments/contributions/${id}`, { method: 'DELETE' });
  },
};
