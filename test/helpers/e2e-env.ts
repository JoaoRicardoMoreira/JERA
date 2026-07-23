process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.PORT = process.env.PORT ?? '3000';
process.env.API_PREFIX = process.env.API_PREFIX ?? '/api/v1';
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://finance_user:finance_password@localhost:5433/finance_control_test?schema=public';
process.env.RUN_DATABASE_TESTS = process.env.RUN_DATABASE_TESTS ?? 'false';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS ?? '10';
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS ?? 'http://localhost:4200';
process.env.RATE_LIMIT_TTL = process.env.RATE_LIMIT_TTL ?? '60';
process.env.RATE_LIMIT_LIMIT = process.env.RATE_LIMIT_LIMIT ?? '100';
process.env.SWAGGER_ENABLED = process.env.SWAGGER_ENABLED ?? 'false';
process.env.SWAGGER_PATH = process.env.SWAGGER_PATH ?? '/docs';
