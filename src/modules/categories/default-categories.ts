import { TransactionType } from '@prisma/client';

export const DEFAULT_CATEGORIES: ReadonlyArray<{
  name: string;
  type: TransactionType;
}> = [
  { name: 'Salario', type: TransactionType.INCOME },
  { name: 'Freelance', type: TransactionType.INCOME },
  { name: 'Investimentos', type: TransactionType.INCOME },
  { name: 'Alimentacao', type: TransactionType.EXPENSE },
  { name: 'Moradia', type: TransactionType.EXPENSE },
  { name: 'Transporte', type: TransactionType.EXPENSE },
  { name: 'Saude', type: TransactionType.EXPENSE },
  { name: 'Educacao', type: TransactionType.EXPENSE },
  { name: 'Lazer', type: TransactionType.EXPENSE },
  { name: 'Outros', type: TransactionType.EXPENSE },
];
