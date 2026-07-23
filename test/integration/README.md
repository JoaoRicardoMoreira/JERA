# Integration Tests

Integration tests use a dedicated PostgreSQL database and never run against the development database.

Run the test database and apply migrations before executing the suite:

```bash
docker compose up -d postgres_test
TEST_DATABASE_URL="postgresql://finance_user:finance_password@localhost:5433/finance_control_test?schema=public" npx prisma migrate deploy
RUN_DATABASE_TESTS=true TEST_DATABASE_URL="postgresql://finance_user:finance_password@localhost:5433/finance_control_test?schema=public" npm run test:integration
```

The suite is skipped unless `RUN_DATABASE_TESTS=true` and `TEST_DATABASE_URL` are both defined. If it runs, the database name must contain `test`; otherwise execution fails to protect local development data.
