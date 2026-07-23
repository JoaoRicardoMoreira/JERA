import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { GOALS_REPOSITORY } from './interfaces/goal-repository.interface';
import { GOALS_SERVICE } from './interfaces/goal-service.interface';
import { GoalsController } from './goals.controller';
import { GoalsRepository } from './goals.repository';
import { GoalsService } from './goals.service';
import { GoalValidator } from './validators/goal.validator';

@Module({
  imports: [PrismaModule],
  controllers: [GoalsController],
  providers: [
    GoalValidator,
    {
      provide: GOALS_REPOSITORY,
      useClass: GoalsRepository,
    },
    {
      provide: GOALS_SERVICE,
      useClass: GoalsService,
    },
    GoalsService,
  ],
  exports: [GOALS_SERVICE, GoalsService],
})
export class GoalsModule {}
