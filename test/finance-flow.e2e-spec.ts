import { INestApplication } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import * as request from 'supertest';

import {
  createE2ECategory,
  createE2ETransaction,
  registerAndLogin,
} from './helpers/auth.helper';
import {
  cleanupE2EDatabase,
  createE2EApp,
  describeWithE2EDatabase,
} from './helpers/e2e-app.helper';

describeWithE2EDatabase('Finance Flow E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createE2EApp();
  });

  beforeEach(async () => {
    await cleanupE2EDatabase(app);
  });

  afterEach(async () => {
    await cleanupE2EDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates income, expense, goal, recurrence and reads dashboard', async () => {
    const session = await registerAndLogin(app, 'finance-flow');
    const expenseCategory = await createE2ECategory(
      app,
      session.userId,
      TransactionType.EXPENSE,
      'Market',
    );
    const incomeCategory = await createE2ECategory(
      app,
      session.userId,
      TransactionType.INCOME,
      'Salary',
    );
    const auth = { Authorization: `Bearer ${session.accessToken}` };

    await request(app.getHttpServer())
      .post('/api/v1/transactions/income')
      .set(auth)
      .send({
        amount: '5000.00',
        categoryId: incomeCategory.id,
        description: 'Salary',
        occurredAt: '2026-07-03T12:00:00.000Z',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/transactions/expense')
      .set(auth)
      .send({
        amount: '250.00',
        categoryId: expenseCategory.id,
        description: 'Groceries',
        occurredAt: '2026-07-04T12:00:00.000Z',
      })
      .expect(201);

    await request(app.getHttpServer())
      .put('/api/v1/goals')
      .set(auth)
      .send({
        categoryId: expenseCategory.id,
        amount: '1000.00',
        month: 7,
        year: 2026,
      })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/recurrences')
      .set(auth)
      .send({
        amount: '99.90',
        type: TransactionType.EXPENSE,
        frequency: 'MONTHLY',
        categoryId: expenseCategory.id,
        description: 'Subscription',
        startDate: '2026-07-05T00:00:00.000Z',
      })
      .expect(201);

    const dashboardResponse = await request(app.getHttpServer())
      .get('/api/v1/dashboard/monthly-summary?month=7&year=2026')
      .set(auth)
      .expect(200);

    expect(dashboardResponse.body.data.totalIncome).toBe('5000.00');
    expect(dashboardResponse.body.data.totalExpense).toBe('250.00');
  });

  it('does not delete another user transaction', async () => {
    const owner = await registerAndLogin(app, 'owner');
    const other = await registerAndLogin(app, 'other');
    const category = await createE2ECategory(
      app,
      owner.userId,
      TransactionType.EXPENSE,
      'Owner Expense',
    );
    const transaction = await createE2ETransaction(app, {
      userId: owner.userId,
      categoryId: category.id,
      amount: '20.00',
      type: TransactionType.EXPENSE,
      occurredAt: new Date(Date.UTC(2026, 6, 4)),
    });

    await request(app.getHttpServer())
      .delete(`/api/v1/transactions/${transaction.id}`)
      .set({ Authorization: `Bearer ${other.accessToken}` })
      .expect(404);
  });
});
