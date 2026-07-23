import { AuthUser } from '@/types/bff.models';

export const Permission = {
  DASHBOARD_READ: 'dashboard:read',
  TRANSACTIONS_READ: 'transactions:read',
  TRANSACTIONS_CREATE: 'transactions:create',
  TRANSACTIONS_DELETE: 'transactions:delete',
  GOALS_MANAGE: 'goals:manage',
  RECURRENCES_MANAGE: 'recurrences:manage',
  INVESTMENTS_READ: 'investments:read',
  INVESTMENTS_MANAGE: 'investments:manage',
} as const;

export function hasPermission(user: AuthUser | null, permission: string) {
  return user?.permissions.includes(permission) ?? false;
}

export function hasAnyPermission(user: AuthUser | null, permissions: string[]) {
  return permissions.some((permission) => hasPermission(user, permission));
}
