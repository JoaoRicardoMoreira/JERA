import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  cleanupE2EDatabase,
  createE2EApp,
  describeWithE2EDatabase,
} from './helpers/e2e-app.helper';

describeWithE2EDatabase('Auth E2E', () => {
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

  it('registers, refreshes and logs out a user session', async () => {
    const email = 'auth-flow@example.com';
    const password = 'StrongPass123';

    const registerResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'Auth Flow', email, password })
      .expect(201);

    expect(registerResponse.body.success).toBe(true);
    expect(registerResponse.body.data.accessToken).toEqual(expect.any(String));
    expect(registerResponse.body.data.refreshToken).toEqual(expect.any(String));

    const refreshResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: registerResponse.body.data.refreshToken })
      .expect(200);

    expect(refreshResponse.body.data.accessToken).toEqual(expect.any(String));
    expect(refreshResponse.body.data.refreshToken).not.toBe(
      registerResponse.body.data.refreshToken,
    );

    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .send({ refreshToken: refreshResponse.body.data.refreshToken })
      .expect(200);
  });
});
