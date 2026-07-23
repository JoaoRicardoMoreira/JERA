import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status =
          typeof error === 'object' && error && 'details' in error
            ? Number((error as { details?: { statusCode?: number } }).details?.statusCode)
            : 0;

        if (status === 401 || status === 403) {
          return false;
        }

        return failureCount < 1;
      },
      staleTime: 30_000,
    },
  },
});
