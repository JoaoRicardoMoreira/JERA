import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import {
  CsvTransactionRow,
  CsvValidationError,
  UploadedCsvFile,
} from '../interfaces/csv-row.interface';
import { CsvMapper } from '../mapper/csv.mapper';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class CsvValidator {
  ensureAuthenticatedUserId(userId: string | undefined): string {
    if (!userId) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Usuario autenticado nao encontrado no contexto da requisicao.',
      });
    }

    return userId;
  }

  ensureCsvFile(file: UploadedCsvFile | undefined): UploadedCsvFile {
    if (!file) {
      throw new BadRequestException({
        code: 'CSV_FILE_REQUIRED',
        message: 'Arquivo CSV nao enviado.',
      });
    }

    if (file.size === 0 || file.buffer.length === 0) {
      throw new BadRequestException({
        code: 'CSV_FILE_EMPTY',
        message: 'Arquivo CSV vazio.',
      });
    }

    const hasCsvName = file.originalname.toLowerCase().endsWith('.csv');
    const hasCsvMimeType = ['text/csv', 'application/csv', 'application/vnd.ms-excel'].includes(
      file.mimetype,
    );

    if (!hasCsvName && !hasCsvMimeType) {
      throw new BadRequestException({
        code: 'CSV_FILE_INVALID_TYPE',
        message: 'Somente arquivos CSV sao suportados.',
      });
    }

    return file;
  }

  parseAndValidate(content: string): CsvTransactionRow[] {
    const parsedRows = CsvMapper.parse(content);

    if (parsedRows.length < 2) {
      throw this.invalidCsv([
        { line: 1, message: 'CSV deve possuir cabecalho e ao menos uma linha.' },
      ]);
    }

    this.validateHeader(parsedRows[0]);

    const errors: CsvValidationError[] = [];
    const rows = parsedRows.slice(1).map((cells, index) => {
      const line = index + 2;
      const row = this.toTransactionRow(cells, line, errors);

      return row;
    });

    if (errors.length > 0) {
      throw this.invalidCsv(errors);
    }

    return rows;
  }

  private validateHeader(header: string[]): void {
    const expectedHeader = CsvMapper.expectedHeader();
    const isValid =
      header.length === expectedHeader.length &&
      expectedHeader.every((expected, index) => header[index] === expected);

    if (!isValid) {
      throw this.invalidCsv([
        {
          line: 1,
          message: `Cabecalho invalido. Use: ${CsvMapper.header()}.`,
        },
      ]);
    }
  }

  private toTransactionRow(
    cells: string[],
    line: number,
    errors: CsvValidationError[],
  ): CsvTransactionRow {
    if (cells.length !== CsvMapper.expectedHeader().length) {
      errors.push({
        line,
        message: 'Linha deve conter exatamente 5 colunas.',
      });
    }

    const [type, amount, occurredAt, description, categoryId] = cells;

    if (!Object.values(TransactionType).includes(type as TransactionType)) {
      errors.push({
        line,
        message: 'Tipo deve ser INCOME ou EXPENSE.',
      });
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount ?? '') || Number(amount) <= 0) {
      errors.push({
        line,
        message: 'Valor deve ser positivo e usar ponto decimal com ate 2 casas.',
      });
    }

    if (!occurredAt || Number.isNaN(new Date(occurredAt).getTime())) {
      errors.push({
        line,
        message: 'Data occurredAt deve estar em formato ISO 8601 valido.',
      });
    }

    if (description && description.length > 255) {
      errors.push({
        line,
        message: 'Descricao deve ter no maximo 255 caracteres.',
      });
    }

    if (categoryId && !UUID_PATTERN.test(categoryId)) {
      errors.push({
        line,
        message: 'categoryId deve ser um UUID valido quando informado.',
      });
    }

    return {
      line,
      type: type as TransactionType,
      amount,
      occurredAt,
      description: description || undefined,
      categoryId: categoryId || undefined,
    };
  }

  private invalidCsv(errors: CsvValidationError[]): BadRequestException {
    return new BadRequestException({
      code: 'CSV_VALIDATION_ERROR',
      message: 'CSV invalido.',
      details: errors,
    });
  }
}
