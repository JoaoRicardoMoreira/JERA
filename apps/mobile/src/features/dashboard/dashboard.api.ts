import { apiRequest } from '@/lib/api/client';
import { ChartsResponse, MonthlySummaryResponse } from '@/types/bff.models';

export const dashboardApi = {
  summary(month: number, year: number) {
    return apiRequest<MonthlySummaryResponse>(
      `/dashboard/monthly-summary?month=${month}&year=${year}`,
    );
  },

  charts(month: number, year: number) {
    return apiRequest<ChartsResponse>(`/dashboard/charts?month=${month}&year=${year}`);
  },
};
