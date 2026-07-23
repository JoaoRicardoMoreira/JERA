ALTER TABLE "investment_contributions"
ADD COLUMN "contributed_at" TIMESTAMP(3);

UPDATE "investment_contributions"
SET "contributed_at" = make_date("year", "month", 1)::timestamp;

ALTER TABLE "investment_contributions"
ALTER COLUMN "contributed_at" SET NOT NULL;

DROP INDEX IF EXISTS "uq_investment_contributions_user_period";

CREATE INDEX "idx_investment_contributions_user_date"
ON "investment_contributions"("user_id", "contributed_at");
