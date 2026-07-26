import type { FinancialGoalCategory } from '@/lib/types';
import type { IconName } from '@/components/Icon';

export const FINANCIAL_GOAL_CATEGORIES: ReadonlyArray<{
  value: FinancialGoalCategory;
  label: string;
  image: string;
  icon: IconName;
}> = [
  {
    value: 'HOME',
    label: 'Casa nova',
    image: '/brand/jera-goal-home.jpg',
    icon: 'nordicGoalHome',
  },
  {
    value: 'TRAVEL',
    label: 'Viagem',
    image: '/brand/jera-goal-travel.jpg',
    icon: 'nordicGoalTravel',
  },
  {
    value: 'CAR',
    label: 'Carro',
    image: '/brand/jera-goal-car.jpg',
    icon: 'nordicGoalCar',
  },
  {
    value: 'EMERGENCY_RESERVE',
    label: 'Reserva de emergência',
    image: '/brand/jera-goal-emergency.jpg',
    icon: 'nordicGoalEmergency',
  },
  {
    value: 'OTHER',
    label: 'Outro',
    image: '/brand/jera-goal-other.jpg',
    icon: 'nordicGoalOther',
  },
];

export function getFinancialGoalCategory(category?: FinancialGoalCategory | null) {
  return (
    FINANCIAL_GOAL_CATEGORIES.find((item) => item.value === category) ??
    FINANCIAL_GOAL_CATEGORIES[FINANCIAL_GOAL_CATEGORIES.length - 1]
  );
}
