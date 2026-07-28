import { PrismaClient, Role, TransactionType } from '@prisma/client';

import { DEFAULT_CATEGORIES } from '../src/modules/categories/default-categories';

const prisma = new PrismaClient();

const DEV_USER_EMAIL = process.env.SEED_USER_EMAIL ?? 'dev@financecontrol.local';
const DEV_USER_NAME = process.env.SEED_USER_NAME ?? 'FinanceControl Dev';
const defaultPermissions = [
  'transactions:read',
  'transactions:create',
  'transactions:update',
  'transactions:delete',
  'goals:manage',
  'financial-goals:manage',
  'payables:manage',
  'recurrences:manage',
  'dashboard:read',
  'investments:read',
  'investments:manage',
  'settlement:read',
];

async function ensureDefaultCategories(userId: string) {
  return Promise.all(
    DEFAULT_CATEGORIES.map((category) =>
      prisma.category.upsert({
        where: {
          userId_name_type: {
            userId,
            name: category.name,
            type: category.type,
          },
        },
        update: {
          deletedAt: null,
        },
        create: {
          userId,
          name: category.name,
          type: category.type,
        },
      }),
    ),
  );
}

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seed must not run in production.');
  }

  const user = await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: {
      deletedAt: null,
      name: DEV_USER_NAME,
      permissions: defaultPermissions,
    },
    create: {
      email: DEV_USER_EMAIL,
      name: DEV_USER_NAME,
      passwordHash: 'seed-user-password-hash-placeholder',
      roles: [Role.USER],
      permissions: defaultPermissions,
    },
  });

  const createdCategories = await ensureDefaultCategories(user.id);

  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();
  const expenseCategories = createdCategories.filter(
    (category) => category.type === TransactionType.EXPENSE,
  );

  await Promise.all(
    expenseCategories.map((category) =>
      prisma.goal.upsert({
        where: {
          userId_categoryId_month_year: {
            userId: user.id,
            categoryId: category.id,
            month,
            year,
          },
        },
        update: {
          deletedAt: null,
        },
        create: {
          userId: user.id,
          categoryId: category.id,
          amount: '0',
          month,
          year,
        },
      }),
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
