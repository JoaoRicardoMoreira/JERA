export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    requestId?: string;
    [key: string]: unknown;
  };
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
