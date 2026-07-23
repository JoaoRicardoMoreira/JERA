import { APP_CONSTANTS } from '../constants/app.constants';
import {
  NormalizedPagination,
  PaginationMeta,
  PaginationOptions,
} from '../interfaces/pagination.interface';

export const normalizePagination = (options: PaginationOptions = {}): NormalizedPagination => {
  const page = Math.max(options.page ?? APP_CONSTANTS.DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(options.limit ?? APP_CONSTANTS.DEFAULT_PAGE_LIMIT, 1),
    APP_CONSTANTS.MAX_PAGE_LIMIT,
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
};

export const buildPaginationMeta = (
  totalItems: number,
  pagination: Pick<NormalizedPagination, 'page' | 'limit'>,
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / pagination.limit);

  return {
    page: pagination.page,
    limit: pagination.limit,
    totalItems,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPreviousPage: pagination.page > 1,
  };
};
