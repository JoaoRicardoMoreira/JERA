export class InvestmentConfigEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly taxaMensalPercent: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}
