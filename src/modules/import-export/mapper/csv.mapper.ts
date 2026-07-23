import { CsvTransactionRow } from '../interfaces/csv-row.interface';

const CSV_HEADER = ['type', 'amount', 'occurredAt', 'description', 'categoryId'];

export class CsvMapper {
  static header(): string {
    return CSV_HEADER.join(',');
  }

  static rowsToCsv(rows: CsvTransactionRow[]): string {
    const lines = rows.map((row) =>
      [row.type, row.amount, row.occurredAt, row.description ?? '', row.categoryId ?? '']
        .map(this.escapeCell)
        .join(','),
    );

    return [this.header(), ...lines].join('\n');
  }

  static parse(content: string): string[][] {
    return content
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0)
      .map((line) => this.parseLine(line));
  }

  static expectedHeader(): string[] {
    return [...CSV_HEADER];
  }

  private static parseLine(line: string): string[] {
    const cells: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const nextChar = line[index + 1];

      if (char === '"' && insideQuotes && nextChar === '"') {
        current += '"';
        index += 1;
        continue;
      }

      if (char === '"') {
        insideQuotes = !insideQuotes;
        continue;
      }

      if (char === ',' && !insideQuotes) {
        cells.push(current);
        current = '';
        continue;
      }

      current += char;
    }

    cells.push(current);

    return cells.map((cell) => cell.trim());
  }

  private static escapeCell(value: string): string {
    if (!/[",\n\r]/.test(value)) {
      return value;
    }

    return `"${value.replace(/"/g, '""')}"`;
  }
}
