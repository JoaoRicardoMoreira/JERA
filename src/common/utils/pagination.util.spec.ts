import { APP_CONSTANTS } from '../constants/app.constants';
import { buildPaginationMeta, normalizePagination } from './pagination.util';

describe('pagination.util', () => {
  describe('normalizePagination', () => {
    it('uses defaults when no options are provided', () => {
      expect(normalizePagination()).toEqual({
        page: APP_CONSTANTS.DEFAULT_PAGE,
        limit: APP_CONSTANTS.DEFAULT_PAGE_LIMIT,
        skip: 0,
        take: APP_CONSTANTS.DEFAULT_PAGE_LIMIT,
      });
    });

    it('clamps page and limit to supported bounds', () => {
      expect(normalizePagination({ page: -2, limit: APP_CONSTANTS.MAX_PAGE_LIMIT + 50 })).toEqual({
        page: 1,
        limit: APP_CONSTANTS.MAX_PAGE_LIMIT,
        skip: 0,
        take: APP_CONSTANTS.MAX_PAGE_LIMIT,
      });
    });

    it('calculates skip and take from page and limit', () => {
      expect(normalizePagination({ page: 3, limit: 25 })).toEqual({
        page: 3,
        limit: 25,
        skip: 50,
        take: 25,
      });
    });
  });

  describe('buildPaginationMeta', () => {
    it('builds pagination metadata with navigation flags', () => {
      expect(buildPaginationMeta(51, { page: 2, limit: 25 })).toEqual({
        page: 2,
        limit: 25,
        totalItems: 51,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });
  });
});
