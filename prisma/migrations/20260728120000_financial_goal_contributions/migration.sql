CREATE TABLE "financial_goal_contributions" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "financial_goal_id" UUID NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "contributed_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "financial_goal_contributions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_financial_goal_contributions_user_date"
ON "financial_goal_contributions"("user_id", "contributed_at");

CREATE INDEX "idx_financial_goal_contributions_goal_date"
ON "financial_goal_contributions"("financial_goal_id", "contributed_at");

ALTER TABLE "financial_goal_contributions"
  ADD CONSTRAINT "financial_goal_contributions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "financial_goal_contributions"
  ADD CONSTRAINT "financial_goal_contributions_financial_goal_id_fkey"
  FOREIGN KEY ("financial_goal_id") REFERENCES "financial_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
