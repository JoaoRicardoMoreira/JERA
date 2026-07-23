import { apiRequest } from '@/lib/api/client';
import { CategoryResponse } from '@/types/bff.models';

export const categoriesApi = {
  list() {
    return apiRequest<CategoryResponse[]>('/categories');
  },
};
