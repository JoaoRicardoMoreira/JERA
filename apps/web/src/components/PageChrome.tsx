'use client';
import { useFinance } from './FinanceProvider';
const months = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
export function PageChrome({ title, action }: { title?: string; action?: React.ReactNode }) {
  const { month, year, setPeriod, loading, error } = useFinance();
  return (
    <>
      <header className="page-header">
        <div>
          <small>
            {title || 'Visao geral'} · {months[month - 1]} {year}
          </small>
        </div>
        <div className="header-actions">
          <select value={month} onChange={(e) => setPeriod(+e.target.value, year)}>
            {months.map((m, i) => (
              <option value={i + 1} key={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            aria-label="Ano"
            type="number"
            value={year}
            onChange={(e) => setPeriod(month, +e.target.value)}
          />
          {action}
        </div>
      </header>
      {loading && <div className="loading" />}
      {error && <div className="error">{error}</div>}
    </>
  );
}
