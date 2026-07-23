import { PrismaClient } from '@prisma/client';

/**
 * Central registration point for Prisma cross-cutting rules.
 *
 * Prisma Client 6 uses client extensions for query interception. No active rule
 * is registered in this task because soft-delete filtering and auditing rules
 * must be introduced together with repositories and business modules.
 */
export function registerPrismaMiddlewares(_prisma: PrismaClient): void {
  // Reserved for future Prisma client extensions.
}
