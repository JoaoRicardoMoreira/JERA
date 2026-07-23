'use client';
import { FormEvent, useState } from 'react';
import { useFinance } from './FinanceProvider';
import type { TransactionType } from '@/lib/types';
export function TransactionModal({
  type,
  open,
  onClose,
}: {
  type: TransactionType;
  open: boolean;
  onClose(): void;
}) {
  const { data, createTransaction } = useFinance();
  const [busy, setBusy] = useState(false);
  if (!open) return null;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await createTransaction(type, {
        description: String(fd.get('description')),
        amount: Number(fd.get('amount')),
        categoryId: String(fd.get('categoryId') || ''),
        occurredAt: String(fd.get('occurredAt')),
      });
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
        <small>Novo lancamento</small>
        <h2>{type === 'INCOME' ? 'Nova Renda' : 'Novo Gasto'}</h2>
        <label>
          Descricao
          <input name="description" required autoFocus />
        </label>
        <div className="form-grid">
          <label>
            Valor
            <input name="amount" type="number" min="0.01" step="0.01" required />
          </label>
          <label>
            Data
            <input
              name="occurredAt"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              required
            />
          </label>
        </div>
        <label>
          Categoria
          <select name="categoryId">
            <option value="">Sem categoria</option>
            {data.categories
              .filter((c) => c.type === type)
              .map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </label>
        <button disabled={busy} className={type === 'INCOME' ? 'button primary' : 'button danger'}>
          {busy ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
