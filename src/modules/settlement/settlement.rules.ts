import { SettlementAtmosphere } from '@prisma/client';

export const SETTLEMENT_RULES_VERSION = 1;

export const SETTLEMENT_STAGES = [
  { key: 'CAMP', label: 'Acampamento', minimum: 0, next: 150, asset: 'camp' },
  {
    key: 'NASCENT_VILLAGE',
    label: 'Aldeia Nascente',
    minimum: 150,
    next: 400,
    asset: 'nascent-village',
  },
  {
    key: 'VIKING_VILLAGE',
    label: 'Vila Viking',
    minimum: 400,
    next: 800,
    asset: 'viking-village',
  },
  {
    key: 'PROSPEROUS_PORT',
    label: 'Porto Próspero',
    minimum: 800,
    next: 1400,
    asset: 'prosperous-port',
  },
  {
    key: 'NORTHERN_DOMAIN',
    label: 'Domínio do Norte',
    minimum: 1400,
    next: 2200,
    asset: 'northern-domain',
  },
  {
    key: 'GREAT_KINGDOM',
    label: 'Grande Reino',
    minimum: 2200,
    next: null,
    asset: 'great-kingdom',
  },
] as const;

const DISTRICT_THRESHOLDS = [0, 40, 100, 200, 350, 550];

export interface SettlementScoreInput {
  totalIncome: number;
  totalExpense: number;
  previousPatrimony: number | null;
  totalPatrimony: number;
  medianIncome: number;
  budgetCount: number;
  respectedBudgetCount: number;
  payableCount: number;
  onTimePayableCount: number;
  investmentContribution: number;
  goalContribution: number;
  emergencyContribution: number;
  emergencyReserveValue: number;
  investmentValue: number;
  completedGoals: number;
  consecutiveIncomeMonths: number;
  hasRecurrences: boolean;
}

export interface SettlementScore {
  development: number;
  hall: number;
  granary: number;
  harbor: number;
  market: number;
  palisade: number;
  achievement: number;
  lighthouse: number;
}

export function scoreSettlement(input: SettlementScoreInput): SettlementScore {
  const incomeBase = Math.max(input.medianIncome, input.totalIncome, 1);
  const patrimonyDelta =
    input.previousPatrimony === null ? 0 : input.totalPatrimony - input.previousPatrimony;
  const growthTarget = incomeBase * 0.1;
  const growthPoints =
    patrimonyDelta <= 0 ? 0 : Math.min(40, Math.round((patrimonyDelta / growthTarget) * 40));
  const savings = Math.max(0, input.totalIncome - input.totalExpense);
  const savingsRate = input.totalIncome > 0 ? savings / input.totalIncome : 0;
  const savingsPoints = Math.min(25, Math.round((savingsRate / 0.15) * 25));
  const budgetPoints =
    input.budgetCount === 0 ? 0 : Math.round((input.respectedBudgetCount / input.budgetCount) * 15);
  const payablePoints =
    input.payableCount === 0 ? 0 : Math.round((input.onTimePayableCount / input.payableCount) * 10);
  const consistencyPoints =
    (input.investmentContribution > 0 ? 5 : 0) + (input.goalContribution > 0 ? 5 : 0);

  const reserveCoverage =
    input.totalExpense > 0 ? input.emergencyReserveValue / input.totalExpense : 0;
  const investmentCoverage = input.investmentValue / incomeBase;

  return {
    development: Math.min(
      100,
      growthPoints + savingsPoints + budgetPoints + payablePoints + consistencyPoints,
    ),
    hall: growthPoints + Math.round(savingsPoints / 2),
    granary:
      Math.min(15, Math.round((reserveCoverage / 3) * 15)) +
      (input.emergencyContribution > 0 ? 10 : 0),
    harbor:
      Math.min(20, Math.round((investmentCoverage / 3) * 20)) +
      (input.investmentContribution > 0 ? 10 : 0),
    market: (input.totalIncome > 0 ? 5 : 0) + (input.consecutiveIncomeMonths >= 3 ? 10 : 0),
    palisade: budgetPoints + Math.round(savingsPoints / 2),
    achievement: (input.goalContribution > 0 ? 10 : 0) + input.completedGoals * 20,
    lighthouse: payablePoints + (input.hasRecurrences ? 5 : 0),
  };
}

export function resolveAtmosphere(input: {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  patrimonyDelta: number;
  overdueCount: number;
}): { atmosphere: SettlementAtmosphere; reason: string } {
  if (input.overdueCount > 0) {
    return {
      atmosphere: SettlementAtmosphere.ATTENTION,
      reason: 'Há compromissos vencidos pedindo uma nova rota para este ciclo.',
    };
  }
  if (input.balance < 0 || input.totalExpense > input.totalIncome) {
    return {
      atmosphere: SettlementAtmosphere.ATTENTION,
      reason: 'O mar está mais agitado, mas o assentamento permanece firme.',
    };
  }
  const savingsRate =
    input.totalIncome > 0 ? (input.totalIncome - input.totalExpense) / input.totalIncome : 0;
  if (input.patrimonyDelta > 0 && savingsRate >= 0.1) {
    return {
      atmosphere: SettlementAtmosphere.FAVORABLE,
      reason: 'Ventos favoráveis acompanham o crescimento deste ciclo.',
    };
  }
  return {
    atmosphere: SettlementAtmosphere.SERENE,
    reason: 'A aldeia segue serena, cultivando cada pequena conquista.',
  };
}

export function resolveStage(points: number) {
  const stage =
    [...SETTLEMENT_STAGES].reverse().find((item) => points >= item.minimum) ?? SETTLEMENT_STAGES[0];
  const progress =
    stage.next === null
      ? 100
      : Math.min(100, Math.max(0, ((points - stage.minimum) / (stage.next - stage.minimum)) * 100));
  const microMilestone = Math.min(5, Math.floor(progress / 20) + (progress > 0 ? 1 : 0));

  return {
    key: stage.key,
    label: stage.label,
    points,
    progressPercentage: Number(progress.toFixed(2)),
    microMilestone,
    nextStageLabel:
      stage.next === null
        ? null
        : (SETTLEMENT_STAGES.find((item) => item.minimum === stage.next)?.label ?? null),
    pointsToNextStage: stage.next === null ? 0 : Math.max(0, stage.next - points),
    assetKey: stage.asset,
  };
}

export function resolveDistrictLevel(points: number): {
  level: number;
  progressPercentage: number;
} {
  let level = 0;
  for (let index = 0; index < DISTRICT_THRESHOLDS.length; index += 1) {
    if (points >= DISTRICT_THRESHOLDS[index]) level = index;
  }
  if (level >= DISTRICT_THRESHOLDS.length - 1) {
    return { level: 5, progressPercentage: 100 };
  }
  const current = DISTRICT_THRESHOLDS[level];
  const next = DISTRICT_THRESHOLDS[level + 1];
  return {
    level,
    progressPercentage: Number((((points - current) / (next - current)) * 100).toFixed(2)),
  };
}

export function median(values: number[]): number {
  if (!values.length) return 0;
  const ordered = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

export function roundedJourneyTarget(value: number): number {
  return Math.max(50, Math.ceil(value / 10) * 10);
}
