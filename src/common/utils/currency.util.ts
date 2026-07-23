export const roundCurrency = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export const addCurrency = (...values: number[]): number =>
  roundCurrency(values.reduce((total, value) => total + value, 0));

export const subtractCurrency = (value: number, amount: number): number =>
  roundCurrency(value - amount);

export const isPositiveCurrency = (value: number): boolean => Number.isFinite(value) && value > 0;
