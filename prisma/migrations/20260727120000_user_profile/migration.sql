CREATE TYPE "Gender" AS ENUM (
  'FEMALE',
  'MALE',
  'NON_BINARY',
  'OTHER',
  'PREFER_NOT_TO_SAY'
);

ALTER TABLE "users"
  ADD COLUMN "birth_date" DATE,
  ADD COLUMN "gender" "Gender",
  ADD COLUMN "phone" VARCHAR(30),
  ADD COLUMN "occupation" VARCHAR(120),
  ADD COLUMN "city" VARCHAR(120),
  ADD COLUMN "state" VARCHAR(80),
  ADD COLUMN "bio" VARCHAR(500);
