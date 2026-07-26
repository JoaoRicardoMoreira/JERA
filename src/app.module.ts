import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { RequestContextMiddleware } from './common/middlewares/request-context.middleware';
import appConfig from './config/app.config';
import corsConfig from './config/cors.config';
import databaseConfig from './config/database.config';
import { envValidationSchema } from './config/env.validation';
import jwtConfig from './config/jwt.config';
import swaggerConfig from './config/swagger.config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { GoalsModule } from './modules/goals/goals.module';
import { FinancialGoalsModule } from './modules/financial-goals/financial-goals.module';
import { HealthModule } from './modules/health/health.module';
import { ImportExportModule } from './modules/import-export/import-export.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { PayablesModule } from './modules/payables/payables.module';
import { RecurrencesModule } from './modules/recurrences/recurrences.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig, jwtConfig, corsConfig, swaggerConfig],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow<number>('app.rateLimit.ttlMs'),
          limit: configService.getOrThrow<number>('app.rateLimit.limit'),
        },
      ],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    TransactionsModule,
    GoalsModule,
    FinancialGoalsModule,
    RecurrencesModule,
    DashboardModule,
    InvestmentsModule,
    PayablesModule,
    ImportExportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
