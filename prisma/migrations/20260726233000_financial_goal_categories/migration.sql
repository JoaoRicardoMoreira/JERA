CREATE TYPE "FinancialGoalCategory" AS ENUM (
  'HOME',
  'TRAVEL',
  'CAR',
  'EMERGENCY_RESERVE',
  'OTHER'
);

ALTER TABLE "financial_goals"
ADD COLUMN "category" "FinancialGoalCategory" NOT NULL DEFAULT 'OTHER';
