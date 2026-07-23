export const queryKeys = {
  categories: ['categories'] as const,
  dashboard: (month: number, year: number) => ['dashboard', month, year] as const,
  charts: (month: number, year: number) => ['charts', month, year] as const,
  transactions: (month: number, year: number, type?: string) =>
    ['transactions', month, year, type ?? 'all'] as const,
  recurrences: ['recurrences'] as const,
  investments: (month: number, year: number) => ['investments', month, year] as const,
};
