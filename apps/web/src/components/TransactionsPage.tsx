'use client';
import Image from 'next/image';
import { useState } from 'react';
import { date, money } from '@/lib/api';
import { useFinance } from './FinanceProvider';
import { PageChrome } from './PageChrome';
import { TransactionModal } from './TransactionModal';
import type { Transaction, TransactionType } from '@/lib/types';
export function TransactionsPage({ type }: { type: TransactionType }) {
  const { data, remove, valuesVisible } = useFinance();
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
  const showMoney = (value: string | number) => (valuesVisible ? money(value) : 'R$ ••••••');
  return (
    <>
      <PageChrome
        title={type === 'INCOME' ? 'Receitas' : 'Despesas'}
        subtitle={
          type === 'INCOME'
            ? 'Recursos que impulsionam sua jornada.'
            : 'Clareza para decidir onde seus recursos devem ir.'
        }
        action={
          <button
            className={type === 'INCOME' ? 'button primary' : 'button secondary'}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + {type === 'INCOME' ? 'Nova Receita' : 'Nova Despesa'}
          </button>
        }
      />
      <section
        className={`content transactions-page ${
          type === 'INCOME' ? 'income-page' : 'expense-page'
        }`}
      >
        {type === 'INCOME' ? (
          <section className="income-hero">
            <div className="income-hero-art" aria-hidden="true">
              <Image
                src="/brand/jera-card-income.jpg"
                fill
                priority
                sizes="(max-width: 800px) 140vw, 80vw"
                quality={92}
                alt=""
              />
            </div>
            <div className="income-hero-copy">
              <span className="eyebrow">Recursos recebidos</span>
              <h1>+ {showMoney(total)}</h1>
              <p>
                <strong>{items.length}</strong> entradas registradas
                <span aria-hidden="true">·</span>
                <strong>{breakdown.length}</strong>{' '}
                {breakdown.length === 1 ? 'categoria' : 'categorias'}
              </p>
              <button
                className="button glass"
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
              >
                Registrar receita <span>→</span>
              </button>
            </div>
          </section>
        ) : (
          <section className="expense-hero">
            <div className="expense-hero-art" aria-hidden="true">
              <Image
                src="/brand/jera-card-expenses.jpg"
                fill
                priority
                sizes="(max-width: 800px) 140vw, 80vw"
                quality={92}
                alt=""
              />
            </div>
            <div className="expense-hero-copy">
              <span className="eyebrow">Recursos utilizados</span>
              <h1>- {showMoney(total)}</h1>
              <p>
                <strong>{items.length}</strong> saídas registradas
                <span aria-hidden="true">·</span>
                <strong>{breakdown.length}</strong>{' '}
                {breakdown.length === 1 ? 'categoria' : 'categorias'}
              </p>
              <button
                className="button expense-glass"
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
              >
                Registrar despesa <span>→</span>
              </button>
            </div>
          </section>
        )}
        {type === 'EXPENSE' && (
          <section className="expense-breakdown-section">
            <div className="transactions-list-heading expense-heading">
              <div>
                <span className="eyebrow">Distribuição</span>
                <h2>Despesas por categoria</h2>
              </div>
              <span>
                {breakdown.length} {breakdown.length === 1 ? 'categoria' : 'categorias'}
              </span>
            </div>
            <div className="breakdown">
              {breakdown.map((b) => (
                <div className="progress-card expense-progress-card" key={b.name}>
                  <span>
                    <b>{b.name}</b>
                    <em>
                      {showMoney(b.value)} ·{' '}
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
        <div className="transactions-list-heading">
          <div>
            <span className="eyebrow">Histórico</span>
            <h2>{type === 'INCOME' ? 'Entradas do período' : 'Saídas do período'}</h2>
          </div>
          <span>
            {items.length} {items.length === 1 ? 'lançamento' : 'lançamentos'}
          </span>
        </div>
        <div className={`table-shell ${type === 'INCOME' ? 'income-table' : 'expense-table'}`}>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
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
                    <b>{t.description || 'Sem descrição'}</b>
                  </td>
                  <td>
                    <span className="pill">{t.categoryName || 'Sem categoria'}</span>
                  </td>
                  <td className={`right ${type === 'INCOME' ? 'income' : ''}`}>
                    {type === 'INCOME' ? '+' : '-'} {showMoney(t.amount)}
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
                          confirm('Excluir este lançamento?') && remove(`/transactions/${t.id}`)
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
                    Nenhuma {type === 'INCOME' ? 'receita' : 'despesa'} neste período
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
