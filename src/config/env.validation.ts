import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
  PORT: Joi.number().port().required(),
  API_PREFIX: Joi.string()
    .pattern(/^\/[a-z0-9-/]+$/)
    .required(),

  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql'] })
    .required(),
  TEST_DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql'] })
    .optional(),
  RUN_DATABASE_TESTS: Joi.boolean().truthy('true').falsy('false').optional(),
  POSTGRES_DB: Joi.string().optional(),
  POSTGRES_USER: Joi.string().optional(),
  POSTGRES_PASSWORD: Joi.string().optional(),
  POSTGRES_TEST_DB: Joi.string().optional(),
  POSTGRES_TEST_USER: Joi.string().optional(),
  POSTGRES_TEST_PASSWORD: Joi.string().optional(),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(10).max(15).required(),
  CORS_ORIGINS: Joi.string().required(),

  RATE_LIMIT_TTL: Joi.number().integer().positive().required(),
  RATE_LIMIT_LIMIT: Joi.number().integer().positive().required(),

  SWAGGER_ENABLED: Joi.boolean().truthy('true').falsy('false').required(),
  SWAGGER_PATH: Joi.string()
    .pattern(/^\/[a-z0-9-/]+$/)
    .required(),
});
