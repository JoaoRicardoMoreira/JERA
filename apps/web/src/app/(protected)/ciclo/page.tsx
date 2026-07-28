'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { Icon } from '@/components/Icon';
import { PageChrome } from '@/components/PageChrome';
import { useFinance } from '@/components/FinanceProvider';
import { api, date, money } from '@/lib/api';
import type { CycleEventType, CycleOverview } from '@/lib/types';

const hiddenValue = 'R$ ••••••';
const eventMeta: Record<
  CycleEventType,
  { label: string; icon: 'nordicIncome' | 'nordicExpense' | 'nordicInvestment' | 'nordicGoals' }
> = {
  INCOME: { label: 'Receita', icon: 'nordicIncome' },
  EXPENSE: { label: 'Despesa', icon: 'nordicExpense' },
  INVESTMENT: { label: 'Investimento', icon: 'nordicInvestment' },
  GOAL: { label: 'Meta', icon: 'nordicGoals' },
};

function chartPoints(values: number[], min: number, range: number, totalCount = values.length) {
  return values
    .map(
      (value, index) =>
        `${(index / Math.max(totalCount - 1, 1)) * 100},${88 - ((value - min) / range) * 72}`,
    )
    .join(' ');
}

export default function CyclePage() {
  const { month, year, valuesVisible } = useFinance();
  const [overview, setOverview] = useState<CycleOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setSummaryOpen(false);
    setLoading(true);
    setError('');
    api<CycleOverview>(`/cycles/overview?month=${month}&year=${year}`)
      .then((result) => {
        if (active) setOverview(result);
      })
      .catch((reason) => {
        if (active)
          setError(reason instanceof Error ? reason.message : 'Não foi possível ler este ciclo.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [month, year]);

  useEffect(() => {
    if (!summaryOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !reviewing) setSummaryOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [reviewing, summaryOpen]);

  const chart = useMemo(() => {
    const points = overview?.map.points ?? [];
    const projected = points.map((point) => Number(point.projectedBalance));
    const realized = points
      .filter((point) => point.realizedBalance !== null)
      .map((point) => Number(point.realizedBalance));
    const all = [...projected, ...realized, 0];
    const min = Math.min(...all);
    const max = Math.max(...all);
    const range = max - min || 1;
    return {
      projected: chartPoints(projected, min, range),
      realized: chartPoints(realized, min, range, points.length),
      zeroY: 88 - ((0 - min) / range) * 72,
      realizedCount: realized.length,
    };
  }, [overview]);

  const attentionPoints = useMemo(() => {
    if (!overview) return [];
    const points: string[] = [];
    const overdue = overview.map.events.filter((event) => event.status === 'OVERDUE');
    const unrespectedBudgets = overview.closing.budgetCount - overview.closing.respectedBudgetCount;

    if (overdue.length === 1) points.push('Há 1 conta vencida pedindo atenção.');
    if (overdue.length > 1) points.push(`Há ${overdue.length} contas vencidas pedindo atenção.`);
    if (overview.map.daysAtRisk > 0) {
      points.push(
        `A projeção passa ${overview.map.daysAtRisk} ${overview.map.daysAtRisk === 1 ? 'dia' : 'dias'} abaixo de zero.`,
      );
    }
    if (unrespectedBudgets === 1) points.push('Um orçamento ultrapassou o limite definido.');
    if (unrespectedBudgets > 1) {
      points.push(`${unrespectedBudgets} orçamentos ultrapassaram os limites definidos.`);
    }
    if (Number(overview.map.projectedBalance) < 0) {
      points.push('O saldo projetado encerra o ciclo no campo negativo.');
    }

    return points;
  }, [overview]);

  const showMoney = (value: string | number) => (valuesVisible ? money(value) : hiddenValue);
  const review = async () => {
    setReviewing(true);
    setError('');
    try {
      const result = await api<CycleOverview>(`/cycles/review?month=${month}&year=${year}`, {
        method: 'POST',
      });
      setOverview(result);
      setSummaryOpen(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível concluir o ritual.');
    } finally {
      setReviewing(false);
    }
  };

  return (
    <>
      <PageChrome
        title="Meu Ciclo"
        subtitle="O que já aconteceu e o que ainda está no horizonte, sem trabalho adicional."
      />
      <main className="cycle-page">
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        {loading && !overview && (
          <div className="cycle-loading">
            <span>ᛃ</span>
            <p>Traçando a rota do ciclo...</p>
          </div>
        )}
        {overview && (
          <>
            <section className="cycle-map-card">
              <header>
                <div>
                  <span className="eyebrow">Mapa do ciclo</span>
                  <h1>Do presente ao próximo horizonte</h1>
                  <p>
                    A linha sólida mostra o que já ocorreu. A linha dourada antecipa os eventos
                    cadastrados.
                  </p>
                </div>
                <div className={`cycle-risk ${overview.map.daysAtRisk ? 'attention' : ''}`}>
                  <span>{overview.map.daysAtRisk ? 'ᚦ' : 'ᛉ'}</span>
                  <div>
                    <small>Rota projetada</small>
                    <b>
                      {overview.map.daysAtRisk
                        ? `${overview.map.daysAtRisk} dias abaixo de zero`
                        : 'Águas seguras'}
                    </b>
                  </div>
                </div>
              </header>
              <div className="cycle-balances">
                <div>
                  <small>Disponível hoje</small>
                  <strong>{showMoney(overview.map.availableBalance)}</strong>
                </div>
                <span aria-hidden="true">→</span>
                <div>
                  <small>Fim do ciclo</small>
                  <strong>{showMoney(overview.map.projectedBalance)}</strong>
                </div>
              </div>
              <div className="cycle-chart">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Mapa do ciclo">
                  <defs>
                    <linearGradient id="cycle-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3ddc84" stopOpacity=".2" />
                      <stop offset="100%" stopColor="#3ddc84" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line
                    x1="0"
                    y1={chart.zeroY}
                    x2="100"
                    y2={chart.zeroY}
                    className="cycle-zero-line"
                  />
                  <polygon points={`0,100 ${chart.projected} 100,100`} fill="url(#cycle-fill)" />
                  <polyline points={chart.projected} className="cycle-projected-line" />
                  {chart.realizedCount > 1 && (
                    <polyline points={chart.realized} className="cycle-realized-line" />
                  )}
                </svg>
                <div>
                  <span>Dia 1</span>
                  <span>Hoje</span>
                  <span>Fim do mês</span>
                </div>
              </div>
            </section>

            <section className="cycle-metrics">
              {[
                ['Receitas previstas', overview.map.projectedIncome, 'income'],
                ['Despesas previstas', overview.map.projectedExpense, 'expense'],
                ['Aportes no porto', overview.map.totalInvestment, 'investment'],
                ['Destinos financiados', overview.map.totalGoalContribution, 'goal'],
              ].map(([label, value, tone]) => (
                <article className={`cycle-metric ${tone}`} key={label}>
                  <small>{label}</small>
                  <strong>{showMoney(value)}</strong>
                </article>
              ))}
            </section>

            <section className="cycle-lower-grid">
              <article className="cycle-events-card">
                <header>
                  <div>
                    <span className="eyebrow">Marcos da jornada</span>
                    <h2>Agenda automática</h2>
                  </div>
                  <small>{overview.map.events.length} eventos</small>
                </header>
                <div className="cycle-event-list">
                  {overview.map.events.map((event) => {
                    const meta = eventMeta[event.type];
                    return (
                      <div className={`cycle-event ${event.status.toLowerCase()}`} key={event.id}>
                        <span className="cycle-event-day">
                          <small>Dia</small>
                          <b>{String(event.day).padStart(2, '0')}</b>
                        </span>
                        <span className={`cycle-event-icon ${event.type.toLowerCase()}`}>
                          <Icon name={meta.icon} size={18} />
                        </span>
                        <div>
                          <b>{event.title}</b>
                          <small>
                            {event.categoryName || meta.label} ·{' '}
                            {event.status === 'REALIZED'
                              ? 'realizado automaticamente'
                              : event.status === 'OVERDUE'
                                ? 'exceção a observar'
                                : 'no horizonte'}
                          </small>
                        </div>
                        <strong>{showMoney(event.amount)}</strong>
                      </div>
                    );
                  })}
                  {!overview.map.events.length && (
                    <div className="cycle-empty">Nenhum marco foi registrado neste ciclo.</div>
                  )}
                </div>
              </article>

              <article className="cycle-ritual-card">
                <Image
                  src="/brand/jera-wolf-insight.png"
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  alt=""
                />
                <div className="cycle-ritual-content">
                  <span className="eyebrow">Ritual de fechamento</span>
                  <h2>A colheita deste ciclo</h2>
                  <p>{overview.closing.message}</p>
                  <dl>
                    <div>
                      <dt>Saldo da jornada</dt>
                      <dd>{showMoney(overview.closing.endingBalance)}</dd>
                    </div>
                    <div>
                      <dt>Taxa preservada</dt>
                      <dd>{overview.closing.savingsRate.toFixed(1)}%</dd>
                    </div>
                    <div>
                      <dt>Orçamentos honrados</dt>
                      <dd>
                        {overview.closing.respectedBudgetCount}/{overview.closing.budgetCount}
                      </dd>
                    </div>
                  </dl>
                  <ul>
                    {overview.closing.achievements.slice(0, 4).map((achievement) => (
                      <li key={achievement}>
                        <span>ᛃ</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  {overview.closing.reviewedAt ? (
                    <div className="cycle-reviewed-state">
                      <div className="cycle-reviewed">
                        <Icon name="check" size={16} />
                        Ritual concluído em {date(overview.closing.reviewedAt)}
                      </div>
                      <button
                        type="button"
                        className="cycle-summary-link"
                        onClick={() => setSummaryOpen(true)}
                      >
                        Rever resumo
                      </button>
                    </div>
                  ) : overview.closing.available ? (
                    <button
                      className="button cycle-review-button"
                      onClick={() => setSummaryOpen(true)}
                    >
                      Concluir ritual
                    </button>
                  ) : (
                    <small className="cycle-ritual-locked">
                      O ritual será aberto nos últimos dias deste ciclo.
                    </small>
                  )}
                </div>
              </article>
            </section>
          </>
        )}
      </main>
      {overview && summaryOpen && (
        <div
          className="overlay cycle-closing-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !reviewing) setSummaryOpen(false);
          }}
        >
          <section
            className="cycle-closing-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cycle-closing-title"
          >
            <button
              type="button"
              className="close"
              onClick={() => setSummaryOpen(false)}
              disabled={reviewing}
              aria-label="Fechar resumo"
            >
              ×
            </button>

            <header className="cycle-closing-header">
              <span className="cycle-closing-rune" aria-hidden="true">
                ᛃ
              </span>
              <div>
                <span className="eyebrow">Ritual de fechamento</span>
                <h2 id="cycle-closing-title">A memória deste ciclo</h2>
                <p>
                  Antes de seguir viagem, contemple o que entrou, o que foi destinado e os sinais
                  que merecem atenção.
                </p>
              </div>
            </header>

            <section className="cycle-closing-balance">
              <div>
                <small>Saldo da jornada</small>
                <strong>{showMoney(overview.closing.endingBalance)}</strong>
              </div>
              <span>
                <b>{overview.closing.savingsRate.toFixed(1)}%</b>
                da renda foi preservada
              </span>
            </section>

            <section className="cycle-closing-totals" aria-label="Resumo financeiro do ciclo">
              {[
                {
                  label: 'Rendas realizadas',
                  value: overview.closing.realizedIncome,
                  icon: 'nordicIncome' as const,
                  tone: 'income',
                },
                {
                  label: 'Despesas realizadas',
                  value: overview.closing.realizedExpense,
                  icon: 'nordicExpense' as const,
                  tone: 'expense',
                },
                {
                  label: 'Investimentos',
                  value: overview.closing.investedAmount,
                  icon: 'nordicInvestment' as const,
                  tone: 'investment',
                },
                {
                  label: 'Aportes em metas',
                  value: overview.closing.goalContributionAmount,
                  icon: 'nordicGoals' as const,
                  tone: 'goal',
                },
              ].map((item) => (
                <article className={`cycle-closing-total ${item.tone}`} key={item.label}>
                  <span>
                    <Icon name={item.icon} size={18} />
                  </span>
                  <small>{item.label}</small>
                  <strong>{showMoney(item.value)}</strong>
                </article>
              ))}
            </section>

            <section className="cycle-closing-insights">
              <article>
                <span className="eyebrow">Destaques da jornada</span>
                <h3>Conquistas deste ciclo</h3>
                <ul>
                  {overview.closing.achievements.map((achievement) => (
                    <li key={achievement}>
                      <span aria-hidden="true">ᛃ</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </article>
              <article className={attentionPoints.length ? 'attention' : 'serene'}>
                <span className="eyebrow">Leitura de Fenrir</span>
                <h3>{attentionPoints.length ? 'Pontos de atenção' : 'Águas tranquilas'}</h3>
                <ul>
                  {attentionPoints.length ? (
                    attentionPoints.map((point) => (
                      <li key={point}>
                        <span aria-hidden="true">ᛉ</span>
                        {point}
                      </li>
                    ))
                  ) : (
                    <li>
                      <span aria-hidden="true">ᛉ</span>
                      Nenhum sinal crítico foi encontrado neste ciclo.
                    </li>
                  )}
                </ul>
              </article>
            </section>

            <footer className="cycle-closing-actions">
              {overview.closing.reviewedAt ? (
                <>
                  <span>
                    <Icon name="check" size={15} />
                    Ciclo guardado em {date(overview.closing.reviewedAt)}
                  </span>
                  <button
                    type="button"
                    className="button cycle-closing-confirm"
                    onClick={() => setSummaryOpen(false)}
                  >
                    Voltar ao ciclo
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setSummaryOpen(false)}
                    disabled={reviewing}
                  >
                    Continuar revisando
                  </button>
                  <button
                    type="button"
                    className="button cycle-closing-confirm"
                    onClick={review}
                    disabled={reviewing}
                    autoFocus
                  >
                    {reviewing ? 'Guardando a memória...' : 'Confirmar fechamento'}
                  </button>
                </>
              )}
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
