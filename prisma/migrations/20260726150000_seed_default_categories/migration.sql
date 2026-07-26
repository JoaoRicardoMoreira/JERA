INSERT INTO "categories" (
  "id",
  "user_id",
  "name",
  "type",
  "created_at",
  "updated_at"
)
SELECT
  gen_random_uuid(),
  "users"."id",
  "defaults"."name",
  "defaults"."type",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "users"
CROSS JOIN (
  VALUES
    ('Salario', 'INCOME'::"TransactionType"),
    ('Freelance', 'INCOME'::"TransactionType"),
    ('Investimentos', 'INCOME'::"TransactionType"),
    ('Alimentacao', 'EXPENSE'::"TransactionType"),
    ('Moradia', 'EXPENSE'::"TransactionType"),
    ('Transporte', 'EXPENSE'::"TransactionType"),
    ('Saude', 'EXPENSE'::"TransactionType"),
    ('Educacao', 'EXPENSE'::"TransactionType"),
    ('Lazer', 'EXPENSE'::"TransactionType"),
    ('Outros', 'EXPENSE'::"TransactionType")
) AS "defaults" ("name", "type")
WHERE "users"."deleted_at" IS NULL
ON CONFLICT ("user_id", "name", "type")
DO UPDATE SET
  "deleted_at" = NULL,
  "updated_at" = CURRENT_TIMESTAMP;
