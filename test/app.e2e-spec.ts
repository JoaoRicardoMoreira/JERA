import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  cleanupE2EDatabase,
  createE2EApp,
  describeWithE2EDatabase,
} from './helpers/e2e-app.helper';

describeWithE2EDatabase('App E2E', () => {
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

  it('rejects protected endpoints without JWT', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/users/me').expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('AUTHENTICATION_REQUIRED');
  });
});
