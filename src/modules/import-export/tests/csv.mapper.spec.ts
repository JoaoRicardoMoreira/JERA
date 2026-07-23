import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import { CsvMapper } from '../mapper/csv.mapper';

describe('CsvMapper', () => {
  it('returns the expected CSV header', () => {
    expect(CsvMapper.header()).toBe('type,amount,occurredAt,description,categoryId');
    expect(CsvMapper.expectedHeader()).toEqual([
      'type',
      'amount',
      'occurredAt',
      'description',
      'categoryId',
    ]);
  });

  it('escapes commas, quotes and line breaks when serializing rows', () => {
    expect(
      CsvMapper.rowsToCsv([
        {
          line: 2,
          type: TransactionType.EXPENSE,
          amount: '12.30',
          occurredAt: '2026-07-03T00:00:00.000Z',
          description: 'Dinner, "family"',
          categoryId: 'category-id',
        },
      ]),
    ).toBe(
      'type,amount,occurredAt,description,categoryId\n' +
        'EXPENSE,12.30,2026-07-03T00:00:00.000Z,"Dinner, ""family""",category-id',
    );
  });

  it('parses CSV content with BOM, quoted commas and escaped quotes', () => {
    expect(
      CsvMapper.parse(
        '\uFEFFtype,amount,occurredAt,description,categoryId\n' +
          'EXPENSE,12.30,2026-07-03T00:00:00.000Z,"Dinner, ""family""",category-id\n',
      ),
    ).toEqual([
      ['type', 'amount', 'occurredAt', 'description', 'categoryId'],
      ['EXPENSE', '12.30', '2026-07-03T00:00:00.000Z', 'Dinner, "family"', 'category-id'],
    ]);
  });
});
