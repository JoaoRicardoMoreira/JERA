CREATE TABLE "investment_configs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "monthly_rate_percent" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "investment_configs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "investment_contributions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "investment_contributions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "investment_configs_user_id_key" ON "investment_configs"("user_id");
CREATE INDEX "idx_investment_configs_user_id" ON "investment_configs"("user_id");
CREATE UNIQUE INDEX "uq_investment_contributions_user_period" ON "investment_contributions"("user_id", "month", "year");
CREATE INDEX "idx_investment_contributions_user_period" ON "investment_contributions"("user_id", "year", "month");

ALTER TABLE "investment_configs" ADD CONSTRAINT "investment_configs_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "investment_contributions" ADD CONSTRAINT "investment_contributions_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
