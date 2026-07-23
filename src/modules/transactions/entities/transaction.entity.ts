import { TransactionType } from './transaction-type.enum';

export class TransactionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly categoryId: string | null,
    public readonly amount: string,
    public readonly type: TransactionType,
    public readonly description: string | null,
    public readonly occurredAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly categoryName?: string | null,
  ) {}
}
