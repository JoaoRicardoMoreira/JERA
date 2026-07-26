ALTER TABLE "investment_contributions"
ADD COLUMN "selic_annual_rate_percent" DECIMAL(8,4),
ADD COLUMN "selic_reference_date" TIMESTAMP(3);

CREATE INDEX "idx_investment_contributions_selic_reference_date"
ON "investment_contributions"("selic_reference_date");
