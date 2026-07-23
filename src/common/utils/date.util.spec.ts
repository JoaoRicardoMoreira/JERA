import { getMonthDateRange, parseOptionalDate, toEndOfDay, toStartOfDay } from './date.util';

describe('date.util', () => {
  it('normalizes dates to start and end of day without mutating the original date', () => {
    const original = new Date(2026, 6, 3, 15, 30, 45, 123);

    expect(toStartOfDay(original)).toEqual(new Date(2026, 6, 3, 0, 0, 0, 0));
    expect(toEndOfDay(original)).toEqual(new Date(2026, 6, 3, 23, 59, 59, 999));
    expect(original).toEqual(new Date(2026, 6, 3, 15, 30, 45, 123));
  });

  it('builds the inclusive date range for a calendar month', () => {
    expect(getMonthDateRange(2026, 2)).toEqual({
      startDate: new Date(2026, 1, 1),
      endDate: new Date(2026, 2, 0, 23, 59, 59, 999),
    });
  });

  it('parses optional dates only when a value is provided', () => {
    expect(parseOptionalDate()).toBeUndefined();
    expect(parseOptionalDate('2026-07-03T12:00:00.000Z')?.toISOString()).toBe(
      '2026-07-03T12:00:00.000Z',
    );
  });
});
