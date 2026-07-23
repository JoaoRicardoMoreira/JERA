import { registerAs } from '@nestjs/config';

const parseOrigins = (origins?: string): string[] =>
  origins
    ? origins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

const assertSafeProductionOrigins = (origins: string[]): void => {
  if (process.env.NODE_ENV === 'production' && origins.includes('*')) {
    throw new Error('CORS_ORIGINS cannot contain wildcard (*) in production.');
  }
};

export default registerAs('cors', () => ({
  origins: (() => {
    const origins = parseOrigins(process.env.CORS_ORIGINS);
    assertSafeProductionOrigins(origins);

    return origins;
  })(),
}));
