CREATE TYPE "SettlementAtmosphere" AS ENUM ('FAVORABLE', 'SERENE', 'ATTENTION');
CREATE TYPE "SettlementJourneyType" AS ENUM (
  'GROW_PATRIMONY',
  'SAVE_INCOME',
  'PAY_BILLS',
  'INVEST',
  'CONTRIBUTE_GOAL'
);
CREATE TYPE "SettlementJourneyStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED');
CREATE TYPE "SettlementJourneyUnit" AS ENUM ('CURRENCY', 'COUNT');

CREATE TABLE "settlement_profiles" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "rules_version" INTEGER NOT NULL DEFAULT 1,
  "reconstructed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "settlement_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "settlement_monthly_snapshots" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "month" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "total_income" DECIMAL(14,2) NOT NULL,
  "total_expense" DECIMAL(14,2) NOT NULL,
  "available_balance" DECIMAL(14,2) NOT NULL,
  "investment_value" DECIMAL(14,2) NOT NULL,
  "goal_reserve_value" DECIMAL(14,2) NOT NULL,
  "total_patrimony" DECIMAL(14,2) NOT NULL,
  "development_points" INTEGER NOT NULL DEFAULT 0,
  "hall_points" INTEGER NOT NULL DEFAULT 0,
  "granary_points" INTEGER NOT NULL DEFAULT 0,
  "harbor_points" INTEGER NOT NULL DEFAULT 0,
  "market_points" INTEGER NOT NULL DEFAULT 0,
  "palisade_points" INTEGER NOT NULL DEFAULT 0,
  "achievement_points" INTEGER NOT NULL DEFAULT 0,
  "lighthouse_points" INTEGER NOT NULL DEFAULT 0,
  "atmosphere" "SettlementAtmosphere" NOT NULL DEFAULT 'SERENE',
  "atmosphere_reason" VARCHAR(180) NOT NULL,
  "is_closed" BOOLEAN NOT NULL DEFAULT false,
  "rules_version" INTEGER NOT NULL DEFAULT 1,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "settlement_monthly_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "settlement_journeys" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "month" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "slot" INTEGER NOT NULL,
  "type" "SettlementJourneyType" NOT NULL,
  "unit" "SettlementJourneyUnit" NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "description" VARCHAR(255) NOT NULL,
  "baseline_value" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "target_value" DECIMAL(14,2) NOT NULL,
  "current_value" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  "status" "SettlementJourneyStatus" NOT NULL DEFAULT 'ACTIVE',
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "settlement_journeys_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "settlement_profiles_user_id_key" ON "settlement_profiles"("user_id");
CREATE UNIQUE INDEX "uq_settlement_snapshots_user_period"
  ON "settlement_monthly_snapshots"("user_id", "year", "month");
CREATE INDEX "idx_settlement_snapshots_user_period"
  ON "settlement_monthly_snapshots"("user_id", "year", "month");
CREATE UNIQUE INDEX "uq_settlement_journeys_user_period_slot"
  ON "settlement_journeys"("user_id", "year", "month", "slot");
CREATE INDEX "idx_settlement_journeys_user_status"
  ON "settlement_journeys"("user_id", "status");

ALTER TABLE "settlement_profiles"
  ADD CONSTRAINT "settlement_profiles_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "settlement_monthly_snapshots"
  ADD CONSTRAINT "settlement_monthly_snapshots_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "settlement_journeys"
  ADD CONSTRAINT "settlement_journeys_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "users"
  ALTER COLUMN "permissions" SET DEFAULT ARRAY[
    'transactions:read',
    'transactions:create',
    'transactions:update',
    'transactions:delete',
    'goals:manage',
    'financial-goals:manage',
    'payables:manage',
    'recurrences:manage',
    'dashboard:read',
    'investments:read',
    'investments:manage',
    'settlement:read'
  ]::VARCHAR(120)[];

UPDATE "users"
SET "permissions" = ARRAY(
  SELECT DISTINCT permission
  FROM unnest("permissions" || ARRAY['settlement:read']::VARCHAR(120)[]) AS permission
);
