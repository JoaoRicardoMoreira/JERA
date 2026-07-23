import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';

import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '../../src/common/filters/prisma-exception.filter';
import { UnexpectedExceptionFilter } from '../../src/common/filters/unexpected-exception.filter';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../src/common/guards/permissions.guard';
import { RolesGuard } from '../../src/common/guards/roles.guard';
import { LoggingInterceptor } from '../../src/common/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { SerializationInterceptor } from '../../src/common/interceptors/serialization.interceptor';
import { validationPipeConfig } from '../../src/config/validation.config';
import { PrismaService } from '../../src/database/prisma.service';

export const hasE2EDatabase = (): boolean =>
  process.env.RUN_DATABASE_TESTS === 'true' && Boolean(process.env.TEST_DATABASE_URL);

export const describeWithE2EDatabase = (name: string, fn: () => void): void => {
  const describeFn = hasE2EDatabase() ? describe : describe.skip;
  describeFn(name, fn);
};

export async function createE2EApp(): Promise<INestApplication> {
  process.env.NODE_ENV = 'test';
  process.env.PORT = process.env.PORT ?? '3000';
  process.env.API_PREFIX = process.env.API_PREFIX ?? '/api/v1';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
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

  if (!hasE2EDatabase()) {
    throw new Error('RUN_DATABASE_TESTS=true and TEST_DATABASE_URL are required for E2E tests.');
  }

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  app.useGlobalFilters(
    new UnexpectedExceptionFilter(configService),
    new PrismaExceptionFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalGuards(
    new JwtAuthGuard(reflector, app.get(JwtService), configService),
    new RolesGuard(reflector),
    new PermissionsGuard(reflector),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
    new SerializationInterceptor(reflector),
  );

  await app.init();

  return app;
}

export async function cleanupE2EDatabase(app: INestApplication): Promise<void> {
  const prisma = app.get(PrismaService);
  await prisma.refreshToken.deleteMany();
  await prisma.recurrence.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}
