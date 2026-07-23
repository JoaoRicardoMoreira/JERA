import { addCurrency, isPositiveCurrency, roundCurrency, subtractCurrency } from './currency.util';

describe('currency.util', () => {
  describe('roundCurrency', () => {
    it('rounds values to two decimal places', () => {
      expect(roundCurrency(10.235)).toBe(10.24);
      expect(roundCurrency(10.234)).toBe(10.23);
    });
  });

  describe('addCurrency', () => {
    it('adds values and normalizes floating point precision', () => {
      expect(addCurrency(0.1, 0.2)).toBe(0.3);
      expect(addCurrency(10, 5.555, 4.445)).toBe(20);
    });
  });

  describe('subtractCurrency', () => {
    it('subtracts values and rounds the result', () => {
      expect(subtractCurrency(20, 4.555)).toBe(15.45);
    });
  });

  describe('isPositiveCurrency', () => {
    it('accepts only finite positive numbers', () => {
      expect(isPositiveCurrency(0.01)).toBe(true);
      expect(isPositiveCurrency(0)).toBe(false);
      expect(isPositiveCurrency(-1)).toBe(false);
      expect(isPositiveCurrency(Number.NaN)).toBe(false);
      expect(isPositiveCurrency(Number.POSITIVE_INFINITY)).toBe(false);
    });
  });
});
