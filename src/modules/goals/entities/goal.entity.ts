export class GoalEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly categoryId: string,
    public readonly categoryName: string,
    public readonly amount: string,
    public readonly month: number,
    public readonly year: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}
