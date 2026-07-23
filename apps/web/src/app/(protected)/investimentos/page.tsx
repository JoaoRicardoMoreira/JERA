'use client';
import { FormEvent, useEffect, useState } from 'react';
import { api, decimal, money } from '@/lib/api';
import type { InvestmentOverview } from '@/lib/types';
import { useFinance } from '@/components/FinanceProvider';
import { PageChrome } from '@/components/PageChrome';
export default function Page() {
  const { month, year } = useFinance();
  const [data, setData] = useState<InvestmentOverview | null>(null);
  const [error, setError] = useState('');
  async function load() {
    try {
      setData(await api(`/investments/overview?month=${month}&year=${year}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
    }
  }
  useEffect(() => {
    void load();
  }, [month, year]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await Promise.all([
      api('/investments/config', {
        method: 'PUT',
        body: JSON.stringify({ taxaMensalPercent: decimal(Number(fd.get('rate'))) }),
      }),
      api('/investments/contributions', {
        method: 'PUT',
        body: JSON.stringify({
          amount: decimal(Number(fd.get('amount'))),
          contributedAt: `${String(fd.get('contributedAt'))}T12:00:00.000Z`,
        }),
      }),
    ]);
    await load();
  }
  return (
    <>
      <PageChrome title="Investimentos" />
      <section className="content">
        {error && <div className="error">{error}</div>}
        <div className="total">
          <small>Patrimonio estimado</small>
          <h1 className="income">{money(data?.patrimonioFinal || 0)}</h1>
        </div>
        <div className="metric-grid investments">
          <div className="card">
            <small>Total aportado</small>
            <strong>{money(data?.totalAportado || 0)}</strong>
          </div>
          <div className="card">
            <small>Taxa mensal</small>
            <strong className="investment-text">{data?.config.taxaMensalPercent || 0}%</strong>
          </div>
          <div className="card">
            <small>Equivalente anual</small>
            <strong>{data?.annualEquivalentPercent?.toFixed(2) || 0}%</strong>
          </div>
        </div>
        <div className="split">
          <form className="card form" onSubmit={submit}>
            <small>Aporte manual</small>
            <h2>Atualizar periodo</h2>
            <label>
              Aporte
              <input name="amount" type="number" min="0" step=".01" required />
            </label>
            <label>
              Data do aporte
              <input
                name="contributedAt"
                type="date"
                defaultValue={`${year}-${String(month).padStart(2, '0')}-01`}
                required
              />
            </label>
            <label>
              Taxa mensal (%)
              <input
                name="rate"
                type="number"
                min="0"
                step=".01"
                defaultValue={data?.config.taxaMensalPercent}
              />
            </label>
            <button className="button investment">Salvar aporte</button>
          </form>
          <div className="card chart">
            <small>Evolucao patrimonial</small>
            <div className="bars">
              {data?.timeline.map((p) => {
                const max = Math.max(...data.timeline.map((x) => Number(x.patrimonio)), 1);
                return (
                  <div key={p.key} title={`${p.label}: ${money(p.patrimonio)}`}>
                    <i style={{ height: `${Math.max((Number(p.patrimonio) / max) * 100, 3)}%` }} />
                    <span>{p.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
