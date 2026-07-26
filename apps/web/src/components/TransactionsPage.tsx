'use client';
import { useState } from 'react';
import { date, money } from '@/lib/api';
import { useFinance } from './FinanceProvider';
import { PageChrome } from './PageChrome';
import { TransactionModal } from './TransactionModal';
import type { Transaction, TransactionType } from '@/lib/types';
export function TransactionsPage({ type }: { type: TransactionType }) {
  const { data, remove } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const items = data.transactions.filter((t) => t.type === type);
  const total = type === 'INCOME' ? data.summary.totalIncome : data.summary.totalExpense;
  const breakdown = Object.values(
    items.reduce<Record<string, { name: string; value: number }>>((acc, t) => {
      const key = t.categoryName || 'Sem categoria';
      acc[key] ??= { name: key, value: 0 };
      acc[key].value += Number(t.amount);
      return acc;
    }, {}),
  );
  return (
    <>
      <PageChrome
        title={type === 'INCOME' ? 'Rendas' : 'Gastos'}
        action={
          <button
            className={type === 'INCOME' ? 'button primary' : 'button secondary'}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + {type === 'INCOME' ? 'Nova Renda' : 'Novo Gasto'}
          </button>
        }
      />
      <section className="content">
        <div className="total">
          <small>Total no periodo</small>
          <h1 className={type === 'INCOME' ? 'income' : ''}>
            {type === 'INCOME' ? '+' : '-'} {money(total)}
          </h1>
        </div>
        {type === 'EXPENSE' && (
          <section>
            <small>Por categoria</small>
            <div className="breakdown">
              {breakdown.map((b) => (
                <div className="progress-card" key={b.name}>
                  <span>
                    <b>{b.name}</b>
                    <em>
                      {money(b.value)} ·{' '}
                      {Number(total) ? Math.round((b.value / Number(total)) * 100) : 0}%
                    </em>
                  </span>
                  <i>
                    <b
                      style={{ width: `${Number(total) ? (b.value / Number(total)) * 100 : 0}%` }}
                    />
                  </i>
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descricao</th>
                <th>Categoria</th>
                <th className="right">Valor</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{date(t.occurredAt)}</td>
                  <td>
                    <b>{t.description || 'Sem descricao'}</b>
                  </td>
                  <td>
                    <span className="pill">{t.categoryName || 'Sem categoria'}</span>
                  </td>
                  <td className={`right ${type === 'INCOME' ? 'income' : ''}`}>
                    {type === 'INCOME' ? '+' : '-'} {money(t.amount)}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="text-button"
                        onClick={() => {
                          setEditing(t);
                          setOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="text-button delete"
                        onClick={() =>
                          confirm('Excluir este lancamento?') && remove(`/transactions/${t.id}`)
                        }
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={5} className="empty">
                    Nenhum {type === 'INCOME' ? 'renda' : 'gasto'} neste periodo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <TransactionModal
        type={type}
        open={open}
        transaction={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
    </>
  );
}
