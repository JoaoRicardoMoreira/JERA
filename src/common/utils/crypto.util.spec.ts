import { createSha256Hash, generateRandomToken, isHashEqual } from './crypto.util';

describe('crypto.util', () => {
  it('generates a hex token with the requested byte size', () => {
    expect(generateRandomToken(8)).toMatch(/^[0-9a-f]{16}$/);
  });

  it('creates stable sha256 hashes', () => {
    expect(createSha256Hash('finance-control')).toBe(createSha256Hash('finance-control'));
    expect(createSha256Hash('finance-control')).not.toBe(createSha256Hash('other-value'));
  });

  it('compares hashes safely and rejects different lengths', () => {
    const hash = createSha256Hash('same-value');

    expect(isHashEqual(hash, createSha256Hash('same-value'))).toBe(true);
    expect(isHashEqual(hash, createSha256Hash('different-value'))).toBe(false);
    expect(isHashEqual(hash, 'short')).toBe(false);
  });
});
