import { Prisma, Transaction, TransactionType as PrismaTransactionType } from '@prisma/client';

import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionType } from '../entities/transaction-type.enum';

type PrismaTransaction = Pick<
  Transaction,
  | 'id'
  | 'userId'
  | 'categoryId'
  | 'amount'
  | 'type'
  | 'description'
  | 'occurredAt'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
  category?: {
    name: string;
  } | null;
};

export class TransactionMapper {
  static toPrismaType(type: TransactionType): PrismaTransactionType {
    return type as PrismaTransactionType;
  }

  static toDomainType(type: PrismaTransactionType): TransactionType {
    return type as TransactionType;
  }

  static toEntity(transaction: PrismaTransaction): TransactionEntity {
    return new TransactionEntity(
      transaction.id,
      transaction.userId,
      transaction.categoryId,
      new Prisma.Decimal(transaction.amount).toFixed(2),
      TransactionMapper.toDomainType(transaction.type),
      transaction.description,
      transaction.occurredAt,
      transaction.createdAt,
      transaction.updatedAt,
      transaction.deletedAt,
      transaction.category?.name ?? null,
    );
  }

  static toResponse(transaction: TransactionEntity): TransactionResponseDto {
    return {
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      categoryId: transaction.categoryId,
      categoryName: transaction.categoryName ?? null,
      description: transaction.description,
      occurredAt: transaction.occurredAt.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}
