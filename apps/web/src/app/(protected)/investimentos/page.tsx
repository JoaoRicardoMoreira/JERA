'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { PageChrome } from '@/components/PageChrome';
import { useFinance } from '@/components/FinanceProvider';
import { api, date, decimal, money } from '@/lib/api';

const ranges = [
  ['7d', '7 dias'],
  ['30d', '30 dias'],
  ['6m', '6 meses'],
  ['12m', '12 meses'],
  ['all', 'Tudo'],
] as const;

const hiddenValue = 'R$ ••••••';
const percent = (value: string | number | null | undefined, digits = 2) =>
  value === null || value === undefined
    ? '—'
    : `${new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(Number(value))}%`;

export default function Page() {
  const { month, year, valuesVisible, data: financeData, refresh } = useFinance();
  const data = financeData.investment;
  const [error, setError] = useState('');
  const [range, setRange] = useState<(typeof ranges)[number][0]>('6m');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const showMoney = (value: string | number) => (valuesVisible ? money(value) : hiddenValue);

  const timeline = useMemo(() => {
    const values = data?.timeline || [];
    if (range === 'all') return values;
    const count = range === '12m' ? 12 : range === '6m' ? 6 : range === '30d' ? 2 : 1;
    return values.slice(-count);
  }, [data?.timeline, range]);

  const chart = useMemo(() => {
    const values = timeline.map((point) => Number(point.patrimonio));
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const spread = max - min || 1;
    const displayPoints = timeline.map((point, index) => {
      const x = timeline.length === 1 ? 50 : 3 + (index / Math.max(timeline.length - 1, 1)) * 94;
      const y = timeline.length === 1 ? 50 : 88 - ((Number(point.patrimonio) - min) / spread) * 68;
      return { ...point, x, y };
    });
    const linePoints =
      displayPoints.length === 1
        ? [
            { ...displayPoints[0], x: 3 },
            { ...displayPoints[0], x: 97 },
          ]
        : displayPoints;

    return {
      displayPoints,
      linePoints,
      polyline: linePoints.map((point) => `${point.x},${point.y}`).join(' '),
      area: linePoints.length
        ? `${linePoints[0].x},96 ${linePoints.map((point) => `${point.x},${point.y}`).join(' ')} ${linePoints.at(-1)?.x},96`
        : '',
    };
  }, [timeline]);

  const totalYield = Number(data?.patrimonioFinal || 0) - Number(data?.totalAportado || 0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      await api('/investments/contributions', {
        method: 'PUT',
        body: JSON.stringify({
          amount: decimal(Number(form.get('amount'))),
          contributedAt: `${String(form.get('contributedAt'))}T12:00:00.000Z`,
        }),
      });
      setModalOpen(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível registrar o aporte.');
    } finally {
      setSaving(false);
    }
  }

  async function removeContribution(id: string) {
    if (!window.confirm('Deseja excluir este aporte?')) return;
    try {
      setError('');
      await api(`/investments/contributions/${id}`, { method: 'DELETE' });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível excluir o aporte.');
    }
  }

  return (
    <>
      <PageChrome
        title="Investimentos"
        subtitle="Cada aporte fortalece a sua jornada rumo ao próximo horizonte."
        action={
          <button className="button investment-action" onClick={() => setModalOpen(true)}>
            + Novo aporte
          </button>
        }
      />

      <section className="content investments-page">
        {error && <div className="error">{error}</div>}

        <section className="investment-hero">
          <div className="investment-hero-art" aria-hidden="true">
            <Image
              src="/brand/jera-card-investments.jpg"
              fill
              priority
              sizes="(max-width: 800px) 140vw, 80vw"
              quality={92}
              alt=""
            />
          </div>
          <div className="investment-hero-copy">
            <span className="eyebrow">Patrimônio investido</span>
            <h1>{showMoney(data?.patrimonioFinal || 0)}</h1>
            <p>Uma floresta não nasce pronta. Ela cresce com constância, ciclo após ciclo.</p>
            <div className="investment-hero-metrics">
              <span>
                <small>Total aportado</small>
                <strong>{showMoney(data?.totalAportado || 0)}</strong>
              </span>
              <span>
                <small>Rendimento estimado</small>
                <strong className={totalYield >= 0 ? 'positive' : 'negative'}>
                  {showMoney(totalYield)}
                </strong>
              </span>
              <span>
                <small>Selic do último aporte</small>
                <strong>{percent(data?.annualEquivalentPercent)} a.a.</strong>
              </span>
            </div>
          </div>
        </section>

        <article className="investment-chart-panel">
          <header>
            <div>
              <span className="eyebrow">Evolução patrimonial</span>
              <h2>Seu patrimônio ao longo do tempo</h2>
            </div>
            <div className="range-tabs investment-ranges" aria-label="Período do gráfico">
              {ranges.map(([value, label]) => (
                <button
                  type="button"
                  className={range === value ? 'active' : ''}
                  key={value}
                  onClick={() => setRange(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          {chart.displayPoints.length ? (
            <>
              <div className="investment-chart-value">
                <strong>{showMoney(data?.patrimonioFinal || 0)}</strong>
                <span>Saldo acumulado no período</span>
              </div>
              <div className="investment-line-chart">
                <div className="investment-chart-stage">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="investment-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ea8ff" stopOpacity=".35" />
                        <stop offset="100%" stopColor="#4ea8ff" stopOpacity="0" />
                      </linearGradient>
                      <filter id="investment-glow">
                        <feGaussianBlur stdDeviation="1.2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <polygon points={chart.area} fill="url(#investment-fill)" />
                    <polyline
                      points={chart.polyline}
                      fill="none"
                      stroke="#4ea8ff"
                      strokeWidth="2.2"
                      vectorEffect="non-scaling-stroke"
                      filter="url(#investment-glow)"
                    />
                  </svg>
                  <div className="investment-chart-markers" aria-hidden="true">
                    {chart.displayPoints.map((point) => (
                      <span
                        key={point.key}
                        style={{ left: `${point.x}%`, top: `${point.y}%` }}
                        title={`${point.label}: ${
                          valuesVisible ? money(point.patrimonio) : hiddenValue
                        }`}
                      >
                        <i />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="investment-chart-labels">
                  {chart.displayPoints.map((point) => (
                    <span key={point.key}>{point.label}</span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="investment-empty">
              <span>ᛃ</span>
              <h3>Seu caminho começa com o primeiro aporte.</h3>
              <p>A Selic da data será consultada e registrada automaticamente.</p>
              <button className="button investment-action" onClick={() => setModalOpen(true)}>
                Fazer primeiro aporte
              </button>
            </div>
          )}
        </article>

        <section className="contribution-section">
          <header>
            <div>
              <span className="eyebrow">Histórico de aportes</span>
              <h2>Cada marco da sua jornada</h2>
            </div>
            <span>{data?.contributions.length || 0} registros</span>
          </header>
          <div className="contribution-list">
            {data?.contributions
              .slice()
              .sort(
                (a, b) => new Date(b.contributedAt).getTime() - new Date(a.contributedAt).getTime(),
              )
              .map((contribution) => (
                <article className="contribution-row" key={contribution.id}>
                  <span className="contribution-rune">ᛃ</span>
                  <div>
                    <strong>{showMoney(contribution.amount)}</strong>
                    <small>Aporte em {date(contribution.contributedAt)}</small>
                  </div>
                  <div>
                    <strong>{percent(contribution.selicAnnualRatePercent)} a.a.</strong>
                    <small>
                      {contribution.selicReferenceDate
                        ? `Selic de ${date(contribution.selicReferenceDate)}`
                        : 'Selic em processamento'}
                    </small>
                  </div>
                  <div>
                    <strong>{percent(contribution.monthlyEquivalentRatePercent, 4)} a.m.</strong>
                    <small>Equivalente mensal</small>
                  </div>
                  <button
                    className="contribution-delete"
                    onClick={() => removeContribution(contribution.id)}
                    aria-label={`Excluir aporte de ${date(contribution.contributedAt)}`}
                  >
                    Excluir
                  </button>
                </article>
              ))}
            {!data?.contributions.length && (
              <div className="investment-empty compact">
                <p>Nenhum aporte registrado até o momento.</p>
              </div>
            )}
          </div>
        </section>
      </section>

      {modalOpen && (
        <div className="overlay" role="presentation" onMouseDown={() => setModalOpen(false)}>
          <form
            className="modal investment-modal"
            onSubmit={submit}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close"
              onClick={() => setModalOpen(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <span className="eyebrow">Novo marco</span>
            <h2>Registrar aporte</h2>
            <p className="investment-modal-intro">
              Informe apenas o valor e a data. A Selic vigente será consultada automaticamente e
              permanecerá vinculada a este aporte.
            </p>
            <label>
              Valor do aporte
              <input name="amount" type="number" min="0.01" step=".01" required autoFocus />
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
            <div className="selic-note">
              <span>ᛉ</span>
              <p>
                <strong>Taxa protegida no tempo</strong>
                Em fins de semana e feriados, usamos a última Selic oficial disponível.
              </p>
            </div>
            <button className="button investment-action" disabled={saving}>
              {saving ? 'Consultando Selic...' : 'Confirmar aporte'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
