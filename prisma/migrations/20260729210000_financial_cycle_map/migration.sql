CREATE TABLE "financial_cycle_reviews" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "month" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "financial_cycle_reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uq_financial_cycle_reviews_user_period"
  ON "financial_cycle_reviews"("user_id", "year", "month");
CREATE INDEX "idx_financial_cycle_reviews_user_period"
  ON "financial_cycle_reviews"("user_id", "year", "month");

ALTER TABLE "financial_cycle_reviews"
  ADD CONSTRAINT "financial_cycle_reviews_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
