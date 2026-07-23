export class AuthSessionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly tokenHash: string,
    public readonly expiresAt: Date,
    public readonly revokedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  get isRevoked(): boolean {
    return Boolean(this.revokedAt);
  }

  get isExpired(): boolean {
    return this.expiresAt.getTime() <= Date.now();
  }
}
