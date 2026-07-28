export type IconName =
  | 'dashboard'
  | 'income'
  | 'expense'
  | 'investment'
  | 'nordicIncome'
  | 'nordicExpense'
  | 'nordicInvestment'
  | 'nordicWealth'
  | 'nordicGoalHome'
  | 'nordicGoalTravel'
  | 'nordicGoalCar'
  | 'nordicGoalEmergency'
  | 'nordicGoalOther'
  | 'nordicDashboard'
  | 'nordicSettlement'
  | 'nordicGoals'
  | 'nordicBudget'
  | 'nordicRepeat'
  | 'nordicSettings'
  | 'goal'
  | 'budget'
  | 'repeat'
  | 'settings'
  | 'menu'
  | 'eye'
  | 'eyeOff'
  | 'bell'
  | 'arrowUp'
  | 'arrowDown'
  | 'wallet'
  | 'calendar'
  | 'plus'
  | 'check';

const paths: Record<IconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  income: (
    <>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </>
  ),
  expense: (
    <>
      <path d="M12 5v14" />
      <path d="m18 13-6 6-6-6" />
    </>
  ),
  investment: (
    <>
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </>
  ),
  nordicIncome: (
    <>
      <path d="M8 21V4" />
      <path d="m8 7 8-4-3 5" />
      <path d="m8 13 8-4-3 5" />
      <path d="M4 21h9" />
    </>
  ),
  nordicExpense: (
    <>
      <path d="M12 3v17" />
      <path d="m5 12 7 8 7-8" />
      <path d="m7.5 7.5 4.5-3 4.5 3" />
      <path d="M7 21h10" />
    </>
  ),
  nordicInvestment: (
    <>
      <path d="m6 4 6 5-4 4-4-3 4-4" />
      <path d="m18 20-6-5 4-4 4 3-4 4" />
      <path d="M5 20 19 4" />
    </>
  ),
  nordicWealth: (
    <>
      <path d="m12 3 6 7-6 7-6-7 6-7Z" />
      <path d="m8.5 14.5-4 6.5" />
      <path d="m15.5 14.5 4 6.5" />
      <path d="M6.5 18h11" />
    </>
  ),
  nordicGoalHome: (
    <>
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
      <path d="m3 8 3 2M21 8l-3 2" />
      <path d="M8 8h8" />
    </>
  ),
  nordicGoalTravel: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
      <path d="m5 5 5 5m4 4 5 5M19 5l-5 5m-4 4-5 5" />
      <path d="m10 3 2-1 2 1M21 10l1 2-1 2M14 21l-2 1-2-1M3 14l-1-2 1-2" />
    </>
  ),
  nordicGoalCar: (
    <>
      <path d="M3 17c4 3 14 3 18-1-5 1-12 1-18-1v2Z" />
      <path d="M8 15V5" />
      <path d="M9 6c4 1 7 3 9 7H9V6Z" />
      <path d="M6 11 3 9v5M5 19l-1 2M19 18l1 2" />
    </>
  ),
  nordicGoalEmergency: (
    <>
      <path d="M12 2 20 5v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5l8-3Z" />
      <path d="M12 18V7M12 10 8 6M12 10l4-4M12 14l-3 3M12 14l3 3" />
    </>
  ),
  nordicGoalOther: (
    <>
      <path d="m12 3 7 9-7 9-7-9 7-9Z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5v4M12 15v4M5 12h4M15 12h4" />
      <path d="m8 8 2 2m4 4 2 2m0-8-2 2m-4 4-2 2" />
    </>
  ),
  nordicDashboard: (
    <>
      <path d="M12 3v7M12 14v7M3 12h7M14 12h7" />
      <path d="m5 5 5 5m4 4 5 5M19 5l-5 5m-4 4-5 5" />
      <path d="m9 3 3 2 3-2M21 9l-2 3 2 3M15 21l-3-2-3 2M3 15l2-3-2-3" />
    </>
  ),
  nordicSettlement: (
    <>
      <path d="m12 3 7 8-7 8-7-8 7-8Z" />
      <path d="m8.5 15.5-4.5 5.5M15.5 15.5 20 21" />
    </>
  ),
  nordicGoals: (
    <>
      <path d="m12 3 7 9-7 9-7-9 7-9Z" />
      <path d="M12 7v10M8.5 12H16" />
      <path d="m12 7-3 3M12 7l3 3" />
    </>
  ),
  nordicBudget: (
    <>
      <path d="M5 3h14v18H5z" />
      <path d="m8 7 3 3-3 3M13 7h3M13 11h3M8 17h8" />
      <path d="M3 6h2M19 6h2M3 18h2M19 18h2" />
    </>
  ),
  nordicRepeat: (
    <>
      <path d="m7 3 5 4-4 4-5-4 4-4Z" />
      <path d="m17 21-5-4 4-4 5 4-4 4Z" />
      <path d="M5 19 19 5" />
    </>
  ),
  nordicSettings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
      <path d="m5 5 5 5m4 4 5 5M19 5l-5 5m-4 4-5 5" />
    </>
  ),
  goal: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  budget: (
    <>
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11V9a3 3 0 0 1 3-3h15" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v2a3 3 0 0 1-3 3H3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.17.36.38.7.6 1 .29.3.67.48 1.1.5h.1v4h-.1c-.43.02-.81.2-1.1.5-.22.3-.43.64-.6 1Z" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a15.1 15.1 0 0 1-2.1 3.1M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7a10.5 10.5 0 0 0 4-.8" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  arrowUp: (
    <>
      <path d="m18 15-6-6-6 6" />
    </>
  ),
  arrowDown: (
    <>
      <path d="m6 9 6 6 6-6" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 6h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V6Z" />
      <path d="M3 6V5a2 2 0 0 1 2-2h13v3" />
      <path d="M16 11h5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
