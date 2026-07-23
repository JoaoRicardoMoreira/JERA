'use client';
import { FormEvent, useState } from 'react';
import { money } from '@/lib/api';
import { useFinance } from '@/components/FinanceProvider';
import { PageChrome } from '@/components/PageChrome';
export default function Page() {
  const { data, createRecurrence, remove, processRecurrences } = useFinance();
  const [open, setOpen] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createRecurrence({
      type: String(fd.get('type')) as 'INCOME' | 'EXPENSE',
      description: String(fd.get('description')),
      amount: Number(fd.get('amount')),
      day: Number(fd.get('day')),
      categoryId: String(fd.get('categoryId') || ''),
    });
    setOpen(false);
  }
  return (
    <>
      <PageChrome
        title="Recorrentes"
        action={
          <>
            <button className="button secondary" onClick={processRecurrences}>
              Processar periodo
            </button>
            <button className="button investment" onClick={() => setOpen(true)}>
              + Novo Recorrente
            </button>
          </>
        }
      />
      <section className="content">
        <div className="total">
          <small>Recorrentes</small>
          <h1>{data.recurrences.length} ativos</h1>
        </div>
        <div className="list">
          {data.recurrences.map((r) => (
            <div className="card row" key={r.id}>
              <div>
                <b>{r.description || 'Sem descricao'}</b>
                <p>
                  {r.type === 'EXPENSE' ? 'Gasto' : 'Renda'} · Dia{' '}
                  {new Date(r.startDate).getUTCDate()} · {r.categoryName || 'Sem categoria'}
                </p>
              </div>
              <span className={r.type === 'EXPENSE' ? 'expense' : 'income'}>{money(r.amount)}</span>
              <button
                className="text-button"
                onClick={() => confirm('Excluir recorrente?') && remove(`/recurrences/${r.id}`)}
              >
                Excluir
              </button>
            </div>
          ))}
          {!data.recurrences.length && <div className="empty card">Nenhum recorrente ativo.</div>}
        </div>
      </section>
      {open && (
        <div className="overlay">
          <form className="modal" onSubmit={submit}>
            <button type="button" className="close" onClick={() => setOpen(false)}>
              ×
            </button>
            <small>Novo agendamento</small>
            <h2>Novo Recorrente</h2>
            <label>
              Tipo
              <select name="type">
                <option value="EXPENSE">Gasto</option>
                <option value="INCOME">Renda</option>
              </select>
            </label>
            <label>
              Descricao
              <input name="description" required />
            </label>
            <div className="form-grid">
              <label>
                Valor
                <input name="amount" type="number" min=".01" step=".01" required />
              </label>
              <label>
                Dia
                <input name="day" type="number" min="1" max="28" required />
              </label>
            </div>
            <label>
              Categoria
              <select name="categoryId">
                <option value="">Sem categoria</option>
                {data.categories.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="button investment">Salvar</button>
          </form>
        </div>
      )}
    </>
  );
}
