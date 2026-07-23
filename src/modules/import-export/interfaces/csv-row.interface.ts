import { TransactionType } from '../../transactions/entities/transaction-type.enum';

export interface CsvTransactionRow {
  line: number;
  type: TransactionType;
  amount: string;
  occurredAt: string;
  description?: string;
  categoryId?: string;
}

export interface CsvValidationError {
  line: number;
  message: string;
}

export interface UploadedCsvFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
