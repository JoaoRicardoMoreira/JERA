'use client';

import Link from 'next/link';
import { useState } from 'react';
import { money } from '@/lib/api';
import { useFinance } from '@/components/FinanceProvider';
import { PageChrome } from '@/components/PageChrome';
import { TransactionModal } from '@/components/TransactionModal';

export default function Dashboard() {
  const { data } = useFinance();
  const [modal, setModal] = useState<'INCOME' | 'EXPENSE' | null>(null);

  return (
    <>
      <PageChrome
        action={
          <>
            <button className="button primary" onClick={() => setModal('INCOME')}>
              + Nova Renda
            </button>
            <button className="button secondary" onClick={() => setModal('EXPENSE')}>
              + Novo Gasto
            </button>
          </>
        }
      />
      <section className="content dashboard">
        <div className="balance">
          <small>Saldo disponível</small>
          <h1>{money(data.summary.balance)}</h1>
        </div>

        <div className="metric-grid dashboard-metrics">
          <Link href="/rendas" className="card">
            <small>Renda mensal</small>
            <strong className="income">+ {money(data.summary.totalIncome)}</strong>
            <footer>
              {data.transactions.filter((item) => item.type === 'INCOME').length} entradas · abrir
              detalhes →
            </footer>
          </Link>
          <Link href="/gastos" className="card">
            <small>Gastos totais</small>
            <strong>- {money(data.summary.totalExpense)}</strong>
            <footer>
              {data.transactions.filter((item) => item.type === 'EXPENSE').length} lançamentos ·
              abrir detalhes →
            </footer>
          </Link>
          <Link href="/investimentos" className="card">
            <small>Aportes no período</small>
            <strong className="investment-text">- {money(data.summary.totalInvestment)}</strong>
            <footer>Patrimônio investido · abrir detalhes →</footer>
          </Link>
        </div>

        <section className="upcoming">
          <div className="section-title">
            <small>Próximos recorrentes</small>
            <Link href="/recorrentes">Ver todos →</Link>
          </div>
          {data.recurrences
            .slice()
            .sort((a, b) => new Date(a.startDate).getDate() - new Date(b.startDate).getDate())
            .slice(0, 3)
            .map((recurrence) => (
              <Link className="row" href="/recorrentes" key={recurrence.id}>
                <span>
                  <i className={recurrence.type === 'INCOME' ? 'dot income-bg' : 'dot'} />
                  {recurrence.description || 'Sem descrição'}
                </span>
                <span>
                  Dia {new Date(recurrence.startDate).getUTCDate()} · {money(recurrence.amount)}
                </span>
              </Link>
            ))}
          {!data.recurrences.length && <div className="empty">Nenhum recorrente ativo.</div>}
        </section>
      </section>
      <TransactionModal type={modal || 'INCOME'} open={!!modal} onClose={() => setModal(null)} />
    </>
  );
}
