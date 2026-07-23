import { INestApplication } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as request from 'supertest';

import { Permission } from '../../src/modules/auth/entities/permission.enum';
import { PrismaService } from '../../src/database/prisma.service';

export interface E2EAuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
}

export async function registerAndLogin(
  app: INestApplication,
  suffix: string,
): Promise<E2EAuthSession> {
  const email = `e2e-${suffix}-${randomUUID()}@example.com`;
  const password = 'StrongPass123';

  const registerResponse = await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send({
      name: `E2E ${suffix}`,
      email,
      password,
    })
    .expect(201);

  const userId = registerResponse.body.data.user.id as string;
  const prisma = app.get(PrismaService);

  await prisma.user.update({
    where: { id: userId },
    data: {
      permissions: [
        Permission.TRANSACTIONS_READ,
        Permission.TRANSACTIONS_CREATE,
        Permission.TRANSACTIONS_DELETE,
        Permission.GOALS_MANAGE,
        Permission.RECURRENCES_MANAGE,
        Permission.DASHBOARD_READ,
      ],
    },
  });

  const loginResponse = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password })
    .expect(200);

  return {
    accessToken: loginResponse.body.data.accessToken,
    refreshToken: loginResponse.body.data.refreshToken,
    userId,
    email,
  };
}

export async function createE2ECategory(
  app: INestApplication,
  userId: string,
  type: TransactionType,
  name: string,
): Promise<{ id: string; name: string; type: TransactionType }> {
  const prisma = app.get(PrismaService);

  return prisma.category.create({
    data: {
      userId,
      name,
      type,
    },
  });
}

export async function createE2ETransaction(
  app: INestApplication,
  input: {
    userId: string;
    categoryId: string;
    amount: string;
    type: TransactionType;
    occurredAt: Date;
    description?: string;
  },
): Promise<{ id: string }> {
  const prisma = app.get(PrismaService);

  return prisma.transaction.create({
    data: {
      userId: input.userId,
      categoryId: input.categoryId,
      amount: new Prisma.Decimal(input.amount),
      type: input.type,
      occurredAt: input.occurredAt,
      description: input.description,
    },
    select: { id: true },
  });
}
