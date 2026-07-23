import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { RECURRENCES_REPOSITORY } from './interfaces/recurrence-repository.interface';
import { RECURRENCES_SERVICE } from './interfaces/recurrence-service.interface';
import { RecurrencesController } from './recurrences.controller';
import { RecurrencesRepository } from './recurrences.repository';
import { RecurrencesService } from './recurrences.service';
import { RecurrenceValidator } from './validators/recurrence.validator';

@Module({
  imports: [PrismaModule],
  controllers: [RecurrencesController],
  providers: [
    RecurrenceValidator,
    {
      provide: RECURRENCES_REPOSITORY,
      useClass: RecurrencesRepository,
    },
    {
      provide: RECURRENCES_SERVICE,
      useClass: RecurrencesService,
    },
    RecurrencesService,
  ],
  exports: [RECURRENCES_SERVICE, RecurrencesService],
})
export class RecurrencesModule {}
