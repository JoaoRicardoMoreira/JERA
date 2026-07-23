import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { INVESTMENTS_REPOSITORY } from './interfaces/investment-repository.interface';
import { INVESTMENTS_SERVICE } from './interfaces/investment-service.interface';
import { InvestmentsController } from './investments.controller';
import { InvestmentsRepository } from './investments.repository';
import { InvestmentsService } from './investments.service';
import { InvestmentValidator } from './validators/investment.validator';

@Module({
  imports: [PrismaModule],
  controllers: [InvestmentsController],
  providers: [
    InvestmentValidator,
    {
      provide: INVESTMENTS_REPOSITORY,
      useClass: InvestmentsRepository,
    },
    {
      provide: INVESTMENTS_SERVICE,
      useClass: InvestmentsService,
    },
    InvestmentsService,
  ],
  exports: [INVESTMENTS_SERVICE, InvestmentsService],
})
export class InvestmentsModule {}
