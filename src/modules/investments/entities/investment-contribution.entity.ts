export class InvestmentContributionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount: string,
    public readonly contributedAt: Date,
    public readonly month: number,
    public readonly year: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}
