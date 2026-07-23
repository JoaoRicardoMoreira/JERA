ALTER TABLE "users"
ALTER COLUMN "permissions" SET DEFAULT ARRAY[
  'transactions:read',
  'transactions:create',
  'transactions:update',
  'transactions:delete',
  'goals:manage',
  'recurrences:manage',
  'dashboard:read',
  'investments:read',
  'investments:manage'
]::VARCHAR(120)[];

UPDATE "users"
SET "permissions" = ARRAY[
  'transactions:read',
  'transactions:create',
  'transactions:update',
  'transactions:delete',
  'goals:manage',
  'recurrences:manage',
  'dashboard:read',
  'investments:read',
  'investments:manage'
]::VARCHAR(120)[]
WHERE "deleted_at" IS NULL
  AND cardinality("permissions") = 0;
