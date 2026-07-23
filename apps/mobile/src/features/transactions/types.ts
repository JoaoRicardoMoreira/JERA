import { TransactionResponse, TransactionType } from '@/types/bff.models';

export type UiTransactionKind = 'renda' | 'gasto';

export interface TransactionViewModel {
  id: string;
  desc: string;
  valor: number;
  data: string;
  type: UiTransactionKind;
  bffType: TransactionType;
  categoria?: string;
  categoryId?: string | null;
}

export function toTransactionViewModel(transaction: TransactionResponse): TransactionViewModel {
  return {
    id: transaction.id,
    desc: transaction.description ?? '',
    valor: Number(transaction.amount),
    data: transaction.occurredAt.slice(0, 10),
    type: transaction.type === 'INCOME' ? 'renda' : 'gasto',
    bffType: transaction.type,
    categoria: transaction.categoryName ?? undefined,
    categoryId: transaction.categoryId,
  };
}
