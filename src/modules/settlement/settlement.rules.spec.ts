import { SettlementAtmosphere } from '@prisma/client';

import {
  median,
  resolveAtmosphere,
  resolveDistrictLevel,
  resolveStage,
  roundedJourneyTarget,
  scoreSettlement,
} from './settlement.rules';

describe('Settlement rules', () => {
  const balancedCycle = {
    totalIncome: 5000,
    totalExpense: 4000,
    previousPatrimony: 5000,
    totalPatrimony: 5500,
    medianIncome: 5000,
    budgetCount: 2,
    respectedBudgetCount: 2,
    payableCount: 2,
    onTimePayableCount: 2,
    investmentContribution: 300,
    goalContribution: 200,
    emergencyContribution: 100,
    emergencyReserveValue: 4000,
    investmentValue: 3000,
    completedGoals: 0,
    consecutiveIncomeMonths: 3,
    hasRecurrences: true,
  };

  it('caps monthly development at one hundred points', () => {
    expect(scoreSettlement(balancedCycle).development).toBe(100);
  });

  it('does not award growth or savings for a negative cycle', () => {
    const score = scoreSettlement({
      ...balancedCycle,
      totalExpense: 5500,
      totalPatrimony: 4500,
      budgetCount: 0,
      respectedBudgetCount: 0,
      payableCount: 0,
      onTimePayableCount: 0,
      investmentContribution: 0,
      goalContribution: 0,
    });

    expect(score.development).toBe(0);
    expect(score.hall).toBe(0);
  });

  it('resolves the permanent stage and its next threshold', () => {
    expect(resolveStage(450)).toMatchObject({
      key: 'VIKING_VILLAGE',
      label: 'Vila Viking',
      pointsToNextStage: 350,
    });
    expect(resolveStage(2400)).toMatchObject({
      key: 'GREAT_KINGDOM',
      progressPercentage: 100,
      pointsToNextStage: 0,
    });
  });

  it('uses temporary attention without changing permanent stage rules', () => {
    expect(
      resolveAtmosphere({
        balance: 100,
        totalIncome: 5000,
        totalExpense: 4000,
        patrimonyDelta: 100,
        overdueCount: 1,
      }).atmosphere,
    ).toBe(SettlementAtmosphere.ATTENTION);
    expect(
      resolveAtmosphere({
        balance: 1000,
        totalIncome: 5000,
        totalExpense: 4000,
        patrimonyDelta: 500,
        overdueCount: 0,
      }).atmosphere,
    ).toBe(SettlementAtmosphere.FAVORABLE);
  });

  it('calculates medians, rounded targets and district progress deterministically', () => {
    expect(median([3000, 5000, 4000])).toBe(4000);
    expect(median([3000, 5000])).toBe(4000);
    expect(roundedJourneyTarget(123)).toBe(130);
    expect(resolveDistrictLevel(70)).toEqual({ level: 1, progressPercentage: 50 });
  });
});
