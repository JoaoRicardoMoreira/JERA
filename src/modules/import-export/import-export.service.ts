import { Injectable } from '@nestjs/common';

import { TransactionsService } from '../transactions/transactions.service';
import { ExportCsvQueryDto } from './dto/export-csv-query.dto';
import { ImportCsvResponseDto } from './dto/import-csv-response.dto';
import { CsvTransactionRow, UploadedCsvFile } from './interfaces/csv-row.interface';
import { CsvMapper } from './mapper/csv.mapper';
import { CsvValidator } from './validators/csv.validator';

@Injectable()
export class ImportExportService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly csvValidator: CsvValidator,
  ) {}

  async exportCsv(userId: string, query: ExportCsvQueryDto): Promise<string> {
    const transactions = await this.transactionsService.getTransactionsForExport(userId, query);
    const rows: CsvTransactionRow[] = transactions.map((transaction, index) => ({
      line: index + 2,
      type: transaction.type,
      amount: transaction.amount,
      occurredAt: transaction.occurredAt,
      description: transaction.description ?? undefined,
      categoryId: transaction.categoryId ?? undefined,
    }));

    return CsvMapper.rowsToCsv(rows);
  }

  async importCsv(
    userId: string,
    file: UploadedCsvFile | undefined,
  ): Promise<ImportCsvResponseDto> {
    const csvFile = this.csvValidator.ensureCsvFile(file);
    const rows = this.csvValidator.parseAndValidate(csvFile.buffer.toString('utf8'));
    const importedCount = await this.transactionsService.importTransactions(userId, rows);

    return { importedCount };
  }
}
