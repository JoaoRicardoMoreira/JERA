import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { DashboardController } from './dashboard.controller';
import { DashboardRepositoryImpl } from './dashboard.repository';
import { DashboardServiceImpl } from './dashboard.service';
import { DASHBOARD_REPOSITORY } from './interfaces/dashboard-repository.interface';
import { DASHBOARD_SERVICE } from './interfaces/dashboard-service.interface';
import { DashboardValidator } from './validators/dashboard.validator';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [
    DashboardValidator,
    {
      provide: DASHBOARD_REPOSITORY,
      useClass: DashboardRepositoryImpl,
    },
    {
      provide: DASHBOARD_SERVICE,
      useClass: DashboardServiceImpl,
    },
    DashboardServiceImpl,
  ],
  exports: [DASHBOARD_SERVICE, DashboardServiceImpl],
})
export class DashboardModule {}
