import { Module } from '@nestjs/common';

import { TransactionsModule } from '../transactions/transactions.module';
import { ImportExportController } from './import-export.controller';
import { ImportExportService } from './import-export.service';
import { CsvValidator } from './validators/csv.validator';

@Module({
  imports: [TransactionsModule],
  controllers: [ImportExportController],
  providers: [ImportExportService, CsvValidator],
})
export class ImportExportModule {}
