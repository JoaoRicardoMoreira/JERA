export const SELIC_RATE_PROVIDER = Symbol('SELIC_RATE_PROVIDER');

export interface SelicRate {
  annualRatePercent: string;
  referenceDate: Date;
}

export interface SelicRateProvider {
  getAnnualRateForDate(date: Date): Promise<SelicRate>;
}
