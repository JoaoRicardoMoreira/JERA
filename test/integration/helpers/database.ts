import { Prisma, RecurrenceFrequency, TransactionType } from '@prisma/client';
import { randomUUID } from 'crypto';

import { PrismaService } from '../../../src/database/prisma.service';

export function getIntegrationDatabaseUrl(): string | null {
  if (process.env.RUN_DATABASE_TESTS !== 'true') {
    return null;
  }

  const databaseUrl = process.env.TEST_DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  const parsedUrl = new URL(databaseUrl);
  const databaseName = parsedUrl.pathname.replace('/', '').toLowerCase();

  if (!databaseName.includes('test')) {
    throw new Error('Integration tests require TEST_DATABASE_URL to point to a test database.');
  }

  return databaseUrl;
}

export function describeWithTestDatabase(name: string, fn: () => void): void {
  const databaseUrl = getIntegrationDatabaseUrl();
  const describeFn = databaseUrl ? describe : describe.skip;

  describeFn(name, fn);
}

export async function createPrismaService(): Promise<PrismaService> {
  const databaseUrl = getIntegrationDatabaseUrl();

  if (!databaseUrl) {
    throw new Error('RUN_DATABASE_TESTS=true and TEST_DATABASE_URL are required for integration tests.');
  }

  process.env.DATABASE_URL = databaseUrl;

  const prisma = new PrismaService();
  await prisma.onModuleInit();

  return prisma;
}

export async function cleanupDatabase(prisma: PrismaService): Promise<void> {
  await prisma.refreshToken.deleteMany();
  await prisma.recurrence.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(prisma: PrismaService, suffix: string = randomUUID()) {
  return prisma.user.create({
    data: {
      name: `Integration User ${suffix}`,
      email: `integration-${suffix}@example.com`,
      passwordHash: 'hashed-password',
      permissions: [
        'transactions:read',
        'transactions:create',
        'transactions:delete',
        'goals:manage',
        'recurrences:manage',
        'dashboard:read',
      ],
    },
  });
}

export async function createTestCategory(
  prisma: PrismaService,
  userId: string,
  type: TransactionType = TransactionType.EXPENSE,
  suffix: string = randomUUID(),
) {
  return prisma.category.create({
    data: {
      userId,
      name: `${type.toLowerCase()}-${suffix}`,
      type,
    },
  });
}

export async function createTestTransaction(
  prisma: PrismaService,
  input: {
    userId: string;
    categoryId?: string | null;
    amount?: string;
    type?: TransactionType;
    description?: string;
    occurredAt?: Date;
    deletedAt?: Date | null;
  },
) {
  return prisma.transaction.create({
    data: {
      userId: input.userId,
      categoryId: input.categoryId,
      amount: new Prisma.Decimal(input.amount ?? '10.00'),
      type: input.type ?? TransactionType.EXPENSE,
      description: input.description,
      occurredAt: input.occurredAt ?? new Date(Date.UTC(2026, 6, 10)),
      deletedAt: input.deletedAt,
    },
  });
}

export async function createTestGoal(
  prisma: PrismaService,
  input: {
    userId: string;
    categoryId: string;
    amount?: string;
    month?: number;
    year?: number;
    deletedAt?: Date | null;
  },
) {
  return prisma.goal.create({
    data: {
      userId: input.userId,
      categoryId: input.categoryId,
      amount: new Prisma.Decimal(input.amount ?? '100.00'),
      month: input.month ?? 7,
      year: input.year ?? 2026,
      deletedAt: input.deletedAt,
    },
  });
}

export async function createTestRecurrence(
  prisma: PrismaService,
  input: {
    userId: string;
    categoryId?: string | null;
    amount?: string;
    type?: TransactionType;
    frequency?: RecurrenceFrequency;
    description?: string;
    startDate?: Date;
    deletedAt?: Date | null;
  },
) {
  return prisma.recurrence.create({
    data: {
      userId: input.userId,
      categoryId: input.categoryId,
      amount: new Prisma.Decimal(input.amount ?? '50.00'),
      type: input.type ?? TransactionType.EXPENSE,
      frequency: input.frequency ?? RecurrenceFrequency.MONTHLY,
      description: input.description,
      startDate: input.startDate ?? new Date(Date.UTC(2026, 0, 1)),
      deletedAt: input.deletedAt,
    },
  });
}
