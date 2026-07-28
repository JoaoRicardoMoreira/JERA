export const Permission = {
  TRANSACTIONS_READ: 'transactions:read',
  TRANSACTIONS_CREATE: 'transactions:create',
  TRANSACTIONS_UPDATE: 'transactions:update',
  TRANSACTIONS_DELETE: 'transactions:delete',
  GOALS_MANAGE: 'goals:manage',
  FINANCIAL_GOALS_MANAGE: 'financial-goals:manage',
  PAYABLES_MANAGE: 'payables:manage',
  RECURRENCES_MANAGE: 'recurrences:manage',
  DASHBOARD_READ: 'dashboard:read',
  INVESTMENTS_READ: 'investments:read',
  INVESTMENTS_MANAGE: 'investments:manage',
  SETTLEMENT_READ: 'settlement:read',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export const DEFAULT_USER_PERMISSIONS: Permission[] = Object.values(Permission);
