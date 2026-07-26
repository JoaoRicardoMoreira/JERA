CREATE TYPE "FinancialGoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE "PayableStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');
CREATE TYPE "PayableOrigin" AS ENUM ('MANUAL', 'RECURRENCE');

CREATE TABLE "financial_goals" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "target_amount" DECIMAL(14,2) NOT NULL,
  "current_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "target_date" TIMESTAMP(3),
  "icon" VARCHAR(40),
  "status" "FinancialGoalStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "financial_goals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payables" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "recurrence_id" UUID,
  "transaction_id" UUID,
  "category_id" UUID,
  "description" VARCHAR(255) NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "competence_month" INTEGER NOT NULL,
  "competence_year" INTEGER NOT NULL,
  "due_date" TIMESTAMP(3) NOT NULL,
  "status" "PayableStatus" NOT NULL DEFAULT 'PENDING',
  "origin" "PayableOrigin" NOT NULL DEFAULT 'MANUAL',
  "paid_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "payables_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payables_transaction_id_key" ON "payables"("transaction_id");
CREATE UNIQUE INDEX "uq_payables_recurrence_competence" ON "payables"("user_id", "recurrence_id", "competence_month", "competence_year");
CREATE INDEX "idx_financial_goals_user_status" ON "financial_goals"("user_id", "status");
CREATE INDEX "idx_payables_user_competence" ON "payables"("user_id", "competence_year", "competence_month");
CREATE INDEX "idx_payables_user_status_due_date" ON "payables"("user_id", "status", "due_date");
CREATE INDEX "idx_payables_category_id" ON "payables"("category_id");

ALTER TABLE "financial_goals"
  ADD CONSTRAINT "financial_goals_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payables"
  ADD CONSTRAINT "payables_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payables"
  ADD CONSTRAINT "payables_recurrence_id_fkey"
  FOREIGN KEY ("recurrence_id") REFERENCES "recurrences"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payables"
  ADD CONSTRAINT "payables_transaction_id_fkey"
  FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payables"
  ADD CONSTRAINT "payables_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
    'investments:manage'
  ]::VARCHAR(120)[];

UPDATE "users"
SET "permissions" = ARRAY(
  SELECT DISTINCT permission
  FROM unnest(
    "permissions" || ARRAY['financial-goals:manage', 'payables:manage']::VARCHAR(120)[]
  ) AS permission
);
