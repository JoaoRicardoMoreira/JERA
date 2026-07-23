export const toStartOfDay = (date: Date): Date => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
};

export const toEndOfDay = (date: Date): Date => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(23, 59, 59, 999);

  return normalizedDate;
};

export const getMonthDateRange = (
  year: number,
  month: number,
): { startDate: Date; endDate: Date } => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return { startDate, endDate };
};

export const parseOptionalDate = (value?: string): Date | undefined => {
  if (!value) {
    return undefined;
  }

  return new Date(value);
};
