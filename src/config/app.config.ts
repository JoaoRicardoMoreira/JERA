import { registerAs } from '@nestjs/config';

export type AppEnvironment = 'development' | 'test' | 'production';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV as AppEnvironment,
  port: Number(process.env.PORT),
  apiPrefix: process.env.API_PREFIX,
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS),
  rateLimit: {
    ttlSeconds: Number(process.env.RATE_LIMIT_TTL),
    ttlMs: Number(process.env.RATE_LIMIT_TTL) * 1000,
    limit: Number(process.env.RATE_LIMIT_LIMIT),
  },
}));
