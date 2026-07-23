import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { TRANSACTIONS_REPOSITORY } from './interfaces/transaction-repository.interface';
import { TRANSACTIONS_SERVICE } from './interfaces/transaction-service.interface';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';
import { TransactionValidator } from './validators/transaction.validator';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [
    TransactionValidator,
    {
      provide: TRANSACTIONS_REPOSITORY,
      useClass: TransactionsRepository,
    },
    {
      provide: TRANSACTIONS_SERVICE,
      useClass: TransactionsService,
    },
    TransactionsService,
  ],
  exports: [TRANSACTIONS_SERVICE, TransactionsService],
})
export class TransactionsModule {}
