'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageChrome } from '@/components/PageChrome';
import { TransactionModal } from '@/components/TransactionModal';
import { useFinance } from '@/components/FinanceProvider';
import { date, money } from '@/lib/api';
import { getFinancialGoalCategory } from '@/lib/financial-goals';

const chartColors = ['#3FAF78', '#4F8FC5', '#C29A46', '#8B6FA8', '#B96C4C', '#708B82'];
const hiddenValue = 'R$ ••••••';

function variation(current: number, previous: number) {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function Variation({ value, inverse = false }: { value: number; inverse?: boolean }) {
  const positive = inverse ? value <= 0 : value >= 0;
  return (
    <span className={`variation ${positive ? 'positive' : 'negative'}`}>
      <Icon name={value >= 0 ? 'arrowUp' : 'arrowDown'} size={13} />
      {Math.abs(value).toFixed(1)}% vs. mês anterior
    </span>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = values
    .map(
      (value, index) =>
        `${(index / Math.max(values.length - 1, 1)) * 100},${32 - ((value - min) / range) * 26}`,
    )
    .join(' ');
  return (
    <svg className="sparkline" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function Dashboard() {
  const { data, valuesVisible, payPayable } = useFinance();
  const [modal, setModal] = useState<'INCOME' | 'EXPENSE' | null>(null);
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);
  const [range, setRange] = useState('6m');
  const summary = data.summary;
  const previous = data.previousSummary;
  const investment = data.investment;
  const showMoney = (value: string | number) => (valuesVisible ? money(value) : hiddenValue);

  const metrics = [
    {
      label: 'Receitas',
      value: summary.totalIncome,
      previous: previous?.totalIncome || 0,
      color: '#3DDC84',
      icon: 'nordicIncome' as const,
      href: '/rendas',
      image: '/brand/jera-card-income.jpg',
      inverse: false,
      spark: [58, 64, 60, 72, 70, Number(summary.totalIncome)],
    },
    {
      label: 'Despesas',
      value: summary.totalExpense,
      previous: previous?.totalExpense || 0,
      color: '#EF4444',
      icon: 'nordicExpense' as const,
      href: '/gastos',
      image: '/brand/jera-card-expenses.jpg',
      inverse: true,
      spark: [52, 49, 60, 55, 48, Number(summary.totalExpense)],
    },
    {
      label: 'Investimentos',
      value: summary.totalInvestment,
      previous: previous?.totalInvestment || 0,
      color: '#4EA8FF',
      icon: 'nordicInvestment' as const,
      href: '/investimentos',
      image: '/brand/jera-card-investments.jpg',
      inverse: false,
      spark: investment?.timeline.slice(-6).map((point) => Number(point.aporte)) || [0],
    },
    {
      label: 'Patrimônio',
      value: investment?.patrimonioFinal || '0',
      previous: investment?.timeline.at(-2)?.patrimonio || 0,
      color: '#D4AF37',
      icon: 'nordicWealth' as const,
      href: '/investimentos',
      image: '/brand/jera-card-wealth.jpg',
      inverse: false,
      spark: investment?.timeline.slice(-6).map((point) => Number(point.patrimonio)) || [0],
    },
  ];

  const categories = data.charts.spendingByCategory;
  const visibleCategories = categories.filter(
    (item) => !hiddenCategories.includes(item.categoryName),
  );
  const visibleTotal = visibleCategories.reduce((sum, item) => sum + Number(item.amount), 0);
  let cursor = 0;
  const doughnut = visibleCategories.length
    ? `conic-gradient(${visibleCategories
        .map((item) => {
          const color =
            chartColors[
              categories.findIndex((entry) => entry.categoryName === item.categoryName) %
                chartColors.length
            ];
          const start = cursor;
          cursor += visibleTotal ? (Number(item.amount) / visibleTotal) * 100 : 0;
          return `${color} ${start}% ${cursor}%`;
        })
        .join(',')})`
    : 'rgba(255,255,255,.06)';

  const timeline = useMemo(() => {
    const values = investment?.timeline || [];
    if (range === 'all') return values;
    const count = range === '12m' ? 12 : range === '6m' ? 6 : range === '30d' ? 2 : 1;
    return values.slice(-count);
  }, [investment?.timeline, range]);
  const lineMax = Math.max(...timeline.map((point) => Number(point.patrimonio)), 1);
  const linePoints =
    timeline.length === 1
      ? `0,${90 - (Number(timeline[0].patrimonio) / lineMax) * 72} 100,${90 - (Number(timeline[0].patrimonio) / lineMax) * 72}`
      : timeline
          .map(
            (point, index) =>
              `${(index / Math.max(timeline.length - 1, 1)) * 100},${90 - (Number(point.patrimonio) / lineMax) * 72}`,
          )
          .join(' ');

  const expenseChange = variation(
    Number(summary.totalExpense),
    Number(previous?.totalExpense || 0),
  );
  const incomeChange = variation(Number(summary.totalIncome), Number(previous?.totalIncome || 0));
  const primaryInsight =
    expenseChange < 0
      ? `Você reduziu suas despesas em ${Math.abs(expenseChange).toFixed(0)}% neste ciclo.`
      : incomeChange > 0
        ? `Sua receita cresceu ${incomeChange.toFixed(0)}% em relação ao mês anterior.`
        : data.financialGoals.length
          ? `Seu próximo marco está a ${money(data.financialGoals[0].remainingAmount)} de distância.`
          : 'Crie sua primeira meta e transforme intenção em progresso.';

  return (
    <>
      <PageChrome
        action={
          <>
            <button className="button primary" onClick={() => setModal('INCOME')}>
              + Receita
            </button>
            <button className="button secondary" onClick={() => setModal('EXPENSE')}>
              + Despesa
            </button>
          </>
        }
      />
      <section className="dashboard-v2">
        <section className="balance-hero">
          <div className="hero-art" aria-hidden="true">
            <Image
              src="/brand/jera-balance-voyage-logo.png"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 80vw"
              alt=""
            />
          </div>
          <div className="hero-copy">
            <span className="eyebrow">Saldo disponível</span>
            <h1>{showMoney(summary.balance)}</h1>
            <Variation value={variation(Number(summary.balance), Number(previous?.balance || 0))} />
            <p>Atualizado agora · visão projetada do mês</p>
            <Link href="/gastos" className="button glass">
              Ver detalhes <span>→</span>
            </Link>
          </div>
        </section>

        <section className="summary-grid" aria-label="Resumo financeiro">
          {metrics.map((metric) => (
            <Link href={metric.href} className="summary-card" key={metric.label}>
              <span className="summary-card-art" aria-hidden="true">
                <Image
                  src={metric.image}
                  fill
                  sizes="(max-width: 800px) calc(100vw - 32px), (max-width: 1180px) 50vw, 25vw"
                  alt=""
                />
              </span>
              <div className="summary-top">
                <span
                  className="metric-icon"
                  style={{ color: metric.color, background: `${metric.color}16` }}
                >
                  <Icon name={metric.icon} size={22} />
                </span>
                <span className="card-link">↗</span>
              </div>
              <small>{metric.label}</small>
              <strong>{showMoney(metric.value)}</strong>
              <Variation
                value={variation(Number(metric.value), Number(metric.previous))}
                inverse={metric.inverse}
              />
              <Sparkline
                values={metric.spark.length > 1 ? metric.spark : [0, ...metric.spark]}
                color={metric.color}
              />
            </Link>
          ))}
        </section>

        <div className="dashboard-section-heading">
          <div>
            <span className="eyebrow">Análise financeira</span>
            <h2>Seu ciclo em perspectiva</h2>
          </div>
        </div>
        <section className="analytics-grid">
          <article className="panel category-panel themed-analytics-panel">
            <span className="analytics-panel-art expense-art" aria-hidden="true">
              <Image
                src="/brand/jera-card-expenses.jpg"
                fill
                sizes="(max-width: 1180px) 100vw, 45vw"
                alt=""
              />
            </span>
            <header>
              <div>
                <small>Despesas</small>
                <h3>Gastos por categoria</h3>
              </div>
              <span className="panel-total">{showMoney(visibleTotal)}</span>
            </header>
            {categories.length ? (
              <div className="category-chart">
                <div
                  className="doughnut"
                  style={{ background: doughnut }}
                  title={`Total: ${money(visibleTotal)}`}
                >
                  <div>
                    <b>{visibleCategories.length}</b>
                    <small>{visibleCategories.length === 1 ? 'categoria' : 'categorias'}</small>
                  </div>
                </div>
                <div className="legend">
                  {categories.map((item, index) => {
                    const hidden = hiddenCategories.includes(item.categoryName);
                    return (
                      <button
                        key={item.categoryName}
                        className={hidden ? 'muted-item' : ''}
                        onClick={() =>
                          setHiddenCategories((current) =>
                            current.includes(item.categoryName)
                              ? current.filter((name) => name !== item.categoryName)
                              : [...current, item.categoryName],
                          )
                        }
                      >
                        <i style={{ background: chartColors[index % chartColors.length] }} />
                        <span>{item.categoryName}</span>
                        <b>{item.percentage.toFixed(0)}%</b>
                        <em>{showMoney(item.amount)}</em>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState text="Registre despesas para visualizar a distribuição." />
            )}
          </article>

          <article className="panel wealth-panel themed-analytics-panel">
            <span className="analytics-panel-art investment-art" aria-hidden="true">
              <Image
                src="/brand/jera-card-investments.jpg"
                fill
                sizes="(max-width: 1180px) 100vw, 55vw"
                alt=""
              />
            </span>
            <header>
              <div>
                <small>Investimentos</small>
                <h3>Evolução patrimonial</h3>
              </div>
              <div className="range-tabs">
                {[
                  ['7d', '7 dias'],
                  ['30d', '30 dias'],
                  ['6m', '6 meses'],
                  ['12m', '12 meses'],
                  ['all', 'Tudo'],
                ].map(([value, label]) => (
                  <button
                    className={range === value ? 'active' : ''}
                    key={value}
                    onClick={() => setRange(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </header>
            {timeline.length ? (
              <>
                <div className="wealth-value">
                  <strong>{showMoney(investment?.patrimonioFinal || 0)}</strong>
                  <span>Patrimônio investido</span>
                </div>
                <div className="line-chart">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-label="Evolução patrimonial"
                  >
                    <defs>
                      <linearGradient id="wealth-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3DDC84" stopOpacity=".26" />
                        <stop offset="100%" stopColor="#3DDC84" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon points={`0,100 ${linePoints} 100,100`} fill="url(#wealth-fill)" />
                    <polyline
                      points={linePoints}
                      fill="none"
                      stroke="#3DDC84"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="chart-labels">
                    {timeline.map((point) => (
                      <span key={point.key} title={`${point.label}: ${money(point.patrimonio)}`}>
                        {point.label}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState text="Seu gráfico surgirá após o primeiro aporte." />
            )}
          </article>
        </section>

        <section className="goals-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="eyebrow">Próximos destinos</span>
              <h2>Metas financeiras</h2>
            </div>
            <Link href="/metas">Ver todas →</Link>
          </div>
          <div className="goal-grid">
            {data.financialGoals.slice(0, 3).map((goal) => {
              const category = getFinancialGoalCategory(goal.category);
              return (
                <article
                  className={`goal-card goal-card-themed ${
                    goal.status === 'COMPLETED' ? 'completed' : ''
                  }`}
                  key={goal.id}
                >
                  <span className="goal-card-art" aria-hidden="true">
                    <Image
                      src={category.image}
                      fill
                      sizes="(max-width: 800px) calc(100vw - 32px), (max-width: 1180px) 50vw, 33vw"
                      alt=""
                    />
                  </span>
                  <div className="goal-card-header">
                    <div className={`goal-icon goal-icon-${goal.category.toLowerCase()}`}>
                      <Icon name={category.icon} />
                    </div>
                    <span className="goal-category">{category.label}</span>
                  </div>
                  <div className="goal-title">
                    <h3>{goal.name}</h3>
                    <span>{goal.progressPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="progress">
                    <i style={{ width: `${goal.progressPercentage}%` }} />
                  </div>
                  <div className="goal-values">
                    <span>
                      <small>Acumulado</small>
                      <b>{showMoney(goal.currentAmount)}</b>
                    </span>
                    <span>
                      <small>Faltam</small>
                      <b>{showMoney(goal.remainingAmount)}</b>
                    </span>
                  </div>
                  <p>
                    {goal.status === 'COMPLETED'
                      ? 'Destino alcançado ✦'
                      : goal.targetDate
                        ? `Previsão: ${date(goal.targetDate)}`
                        : 'Defina uma data para sua jornada'}
                  </p>
                </article>
              );
            })}
            {!data.financialGoals.length && (
              <Link href="/metas" className="goal-card new-goal new-goal-themed">
                <span className="new-goal-art" aria-hidden="true">
                  <Image src="/brand/jera-goal-other.jpg" fill sizes="520px" alt="" />
                </span>
                <span className="new-goal-rune" aria-hidden="true">
                  ᛟ
                </span>
                <small>Primeiro destino</small>
                <h3>Trace sua primeira conquista</h3>
                <p>Todo grande caminho começa com uma meta clara e o primeiro aporte.</p>
                <b>
                  Criar meta <span aria-hidden="true">→</span>
                </b>
              </Link>
            )}
          </div>
        </section>

        <section className="lower-grid">
          <article className="panel bills-panel themed-bills-panel">
            <span className="bills-panel-art" aria-hidden="true">
              <Image
                src="/brand/jera-goal-home.jpg"
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                alt=""
              />
            </span>
            <header>
              <div>
                <small>Agenda da jornada</small>
                <h3>Próximas contas</h3>
              </div>
              <span className="bills-status-summary">
                <i />
                {data.payables.filter((item) => item.status !== 'PAID').length} pendentes
              </span>
            </header>
            <div className="bill-list">
              {data.payables.slice(0, 5).map((bill) => (
                <div className={`bill-row ${bill.status.toLowerCase()}`} key={bill.id}>
                  <span className="bill-icon">
                    <small>Dia</small>
                    <b>{String(new Date(bill.dueDate).getUTCDate()).padStart(2, '0')}</b>
                  </span>
                  <div>
                    <b>{bill.description}</b>
                    <small>
                      {bill.categoryName || 'Sem categoria'} · {date(bill.dueDate)}
                    </small>
                  </div>
                  <div className="bill-amount">
                    <b>{showMoney(bill.amount)}</b>
                    <small>
                      {bill.status === 'PAID'
                        ? 'Pago'
                        : bill.status === 'OVERDUE'
                          ? `${Math.abs(bill.daysUntilDue)} dias em atraso`
                          : bill.daysUntilDue === 0
                            ? 'Vence hoje'
                            : `Vence em ${bill.daysUntilDue} dias`}
                    </small>
                  </div>
                  {bill.status === 'PAID' ? (
                    <span className="paid-check">
                      <Icon name="check" size={16} />
                    </span>
                  ) : (
                    <button
                      className="pay-button"
                      disabled={bill.status === 'CANCELLED'}
                      onClick={() => payPayable(bill.id)}
                    >
                      Marcar como paga
                    </button>
                  )}
                </div>
              ))}
              {!data.payables.length && (
                <EmptyState text="Nenhuma conta futura nesta competência." />
              )}
            </div>
          </article>

          <article className="insight-card">
            <Image
              src="/brand/jera-wolf-insight.png"
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              alt="Lobo da Jera"
            />
            <div className="insight-content">
              <span className="eyebrow">Insight da Jera</span>
              <h3>{primaryInsight}</h3>
              <p>
                {data.financialGoals.length
                  ? 'Mantenha o ritmo e revise seus aportes ao início de cada ciclo.'
                  : 'Metas claras ajudam a direcionar cada escolha financeira.'}
              </p>
              <Link
                href={data.financialGoals.length ? '/metas' : '/metas'}
                className="button glass"
              >
                Ver recomendação →
              </Link>
            </div>
          </article>
        </section>
      </section>
      <TransactionModal
        type={modal || 'INCOME'}
        open={Boolean(modal)}
        onClose={() => setModal(null)}
      />
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="dashboard-empty">
      <span>ᛃ</span>
      <p>{text}</p>
    </div>
  );
}
