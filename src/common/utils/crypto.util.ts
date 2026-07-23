import { createHash, randomBytes, timingSafeEqual } from 'crypto';

export const generateRandomToken = (sizeInBytes = 32): string =>
  randomBytes(sizeInBytes).toString('hex');

export const createSha256Hash = (value: string): string =>
  createHash('sha256').update(value).digest('hex');

export const isHashEqual = (firstHash: string, secondHash: string): boolean => {
  const firstBuffer = Buffer.from(firstHash);
  const secondBuffer = Buffer.from(secondHash);

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return timingSafeEqual(firstBuffer, secondBuffer);
};
