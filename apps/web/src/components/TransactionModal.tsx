'use client';
import { FormEvent, useState } from 'react';
import { useFinance } from './FinanceProvider';
import type { Transaction, TransactionType } from '@/lib/types';

export function TransactionModal({
  type,
  open,
  onClose,
  transaction,
}: {
  type: TransactionType;
  open: boolean;
  onClose(): void;
  transaction?: Transaction | null;
}) {
  const { data, createTransaction, updateTransaction } = useFinance();
  const [busy, setBusy] = useState(false);
  if (!open) return null;

  const editing = Boolean(transaction);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const input = {
        description: String(fd.get('description')),
        amount: Number(fd.get('amount')),
        categoryId: String(fd.get('categoryId') || ''),
        occurredAt: String(fd.get('occurredAt')),
      };

      if (transaction) {
        await updateTransaction(transaction.id, input);
      } else {
        await createTransaction(type, input);
      }
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <button type="button" className="close" onClick={onClose}>
          ×
        </button>
        <small>{editing ? 'Editar lançamento' : 'Novo lançamento'}</small>
        <h2>
          {editing
            ? type === 'INCOME'
              ? 'Editar Renda'
              : 'Editar Gasto'
            : type === 'INCOME'
              ? 'Nova Renda'
              : 'Novo Gasto'}
        </h2>
        <label>
          Descrição
          <input
            name="description"
            defaultValue={transaction?.description ?? ''}
            required
            autoFocus
          />
        </label>
        <div className="form-grid">
          <label>
            Valor
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={transaction?.amount}
              required
            />
          </label>
          <label>
            Data
            <input
              name="occurredAt"
              type="date"
              defaultValue={
                transaction?.occurredAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
              }
              required
            />
          </label>
        </div>
        <label>
          Categoria
          <select name="categoryId" defaultValue={transaction?.categoryId ?? ''}>
            <option value="">Sem categoria</option>
            {data.categories
              .filter((category) => category.type === type)
              .map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </label>
        <button disabled={busy} className={type === 'INCOME' ? 'button primary' : 'button danger'}>
          {busy ? 'Salvando...' : editing ? 'Salvar alterações' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
