'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageChrome } from '@/components/PageChrome';
import { useFinance } from '@/components/FinanceProvider';
import { money } from '@/lib/api';
import type { TransactionType } from '@/lib/types';

type Filter = 'ALL' | TransactionType;

const hiddenValue = 'R$ ••••••';

export default function Page() {
  const { data, createRecurrence, remove, processRecurrences, valuesVisible, month, year } =
    useFinance();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [filter, setFilter] = useState<Filter>('ALL');
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notice, setNotice] = useState('');

  const activeRecurrences = useMemo(
    () => data.recurrences.filter((recurrence) => recurrence.status === 'ACTIVE'),
    [data.recurrences],
  );
  const incomeTotal = activeRecurrences
    .filter((recurrence) => recurrence.type === 'INCOME')
    .reduce((sum, recurrence) => sum + Number(recurrence.amount), 0);
  const expenseTotal = activeRecurrences
    .filter((recurrence) => recurrence.type === 'EXPENSE')
    .reduce((sum, recurrence) => sum + Number(recurrence.amount), 0);
  const projectedBalance = incomeTotal - expenseTotal;
  const visibleRecurrences = activeRecurrences
    .filter((recurrence) => filter === 'ALL' || recurrence.type === filter)
    .slice()
    .sort((a, b) => new Date(a.startDate).getUTCDate() - new Date(b.startDate).getUTCDate());
  const categories = data.categories.filter((category) => category.type === type);
  const showMoney = (value: string | number) => (valuesVisible ? money(value) : hiddenValue);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    const form = new FormData(event.currentTarget);

    try {
      await createRecurrence({
        type,
        description: String(form.get('description')),
        amount: Number(form.get('amount')),
        day: Number(form.get('day')),
        categoryId: String(form.get('categoryId') || ''),
      });
      setOpen(false);
      setNotice('Recorrência adicionada à sua rota financeira.');
    } catch {
      setNotice('');
    } finally {
      setSaving(false);
    }
  }

  async function processPeriod() {
    setProcessing(true);
    setNotice('');
    try {
      await processRecurrences();
      setNotice('Competência processada. Os lançamentos recorrentes estão atualizados.');
    } catch {
      setNotice('');
    } finally {
      setProcessing(false);
    }
  }

  async function removeRecurrence(id: string) {
    if (!window.confirm('Excluir esta recorrência?')) return;
    try {
      await remove(`/recurrences/${id}`);
      setNotice('Recorrência removida da sua rota.');
    } catch {
      setNotice('');
    }
  }

  return (
    <>
      <PageChrome
        title="Recorrências"
        subtitle="Organize os ciclos que se repetem e antecipe cada movimento do mês."
        action={
          <>
            <button
              className="button recurrence-process-action"
              onClick={processPeriod}
              disabled={processing}
            >
              <Icon name="repeat" size={15} />
              {processing ? 'Processando...' : 'Processar competência'}
            </button>
            <button className="button recurrence-primary-action" onClick={() => setOpen(true)}>
              + Nova recorrência
            </button>
          </>
        }
      />

      <section className="content recurrences-page">
        {notice && (
          <div className="recurrence-notice" role="status">
            <Icon name="check" size={15} />
            {notice}
          </div>
        )}

        <section className="recurrence-hero">
          <div className="recurrence-hero-art" aria-hidden="true">
            <Image
              src="/brand/jera-goal-other.jpg"
              fill
              priority
              sizes="(max-width: 800px) 140vw, 80vw"
              quality={92}
              alt=""
            />
          </div>
          <div className="recurrence-hero-copy">
            <span className="eyebrow">Rota mensal</span>
            <h1>
              {activeRecurrences.length}{' '}
              <span>{activeRecurrences.length === 1 ? 'ciclo ativo' : 'ciclos ativos'}</span>
            </h1>
            <p>
              Antecipe entradas e compromissos para navegar o mês com mais segurança e
              previsibilidade.
            </p>
            <div className="recurrence-hero-metrics">
              <span>
                <small>Entradas previstas</small>
                <strong className="income">{showMoney(incomeTotal)}</strong>
              </span>
              <span>
                <small>Saídas previstas</small>
                <strong className="expense">{showMoney(expenseTotal)}</strong>
              </span>
              <span>
                <small>Saldo recorrente</small>
                <strong className={projectedBalance >= 0 ? 'income' : 'expense'}>
                  {showMoney(projectedBalance)}
                </strong>
              </span>
            </div>
          </div>
        </section>

        <section className="recurrence-route-panel">
          <header>
            <div>
              <span className="eyebrow">Calendário da jornada</span>
              <h2>Movimentos recorrentes</h2>
              <p>
                Competência selecionada: {String(month).padStart(2, '0')}/{year}
              </p>
            </div>
            <div className="recurrence-filters" aria-label="Filtrar recorrências">
              {[
                ['ALL', 'Todos'],
                ['INCOME', 'Entradas'],
                ['EXPENSE', 'Saídas'],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={filter === value ? 'active' : ''}
                  onClick={() => setFilter(value as Filter)}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          {visibleRecurrences.length ? (
            <div className="recurrence-list">
              {visibleRecurrences.map((recurrence) => {
                const day = new Date(recurrence.startDate).getUTCDate();
                const isExpense = recurrence.type === 'EXPENSE';
                return (
                  <article
                    className={`recurrence-row ${isExpense ? 'expense-cycle' : 'income-cycle'}`}
                    key={recurrence.id}
                  >
                    <div className="recurrence-day">
                      <small>Dia</small>
                      <strong>{String(day).padStart(2, '0')}</strong>
                    </div>
                    <span className="recurrence-cycle-icon">
                      <Icon name="repeat" size={19} />
                    </span>
                    <div className="recurrence-description">
                      <strong>{recurrence.description || 'Recorrência sem descrição'}</strong>
                      <small>{recurrence.categoryName || 'Sem categoria'} · Repetição mensal</small>
                    </div>
                    <span className={`recurrence-kind ${isExpense ? 'expense' : 'income'}`}>
                      {isExpense ? 'Saída' : 'Entrada'}
                    </span>
                    <strong className={isExpense ? 'expense' : 'income'}>
                      {showMoney(recurrence.amount)}
                    </strong>
                    <button
                      className="recurrence-delete"
                      onClick={() => removeRecurrence(recurrence.id)}
                    >
                      Excluir
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="recurrence-empty">
              <span>ᛞ</span>
              <h3>
                {activeRecurrences.length
                  ? 'Nenhum ciclo encontrado neste filtro.'
                  : 'Sua rota recorrente ainda está vazia.'}
              </h3>
              <p>
                Cadastre salários, assinaturas e contas fixas para antecipar o saldo de cada mês.
              </p>
              {!activeRecurrences.length && (
                <button className="button recurrence-primary-action" onClick={() => setOpen(true)}>
                  Criar primeira recorrência
                </button>
              )}
            </div>
          )}
        </section>
      </section>

      {open && (
        <div className="overlay" role="presentation" onMouseDown={() => setOpen(false)}>
          <form
            className="modal recurrence-modal"
            onSubmit={submit}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <span className="eyebrow">Novo ciclo</span>
            <h2>Criar recorrência</h2>
            <p className="recurrence-modal-intro">
              Este valor fará parte da projeção desde o início da competência, mesmo antes do dia
              previsto para o lançamento.
            </p>

            <div className="recurrence-type-picker">
              <button
                type="button"
                className={type === 'INCOME' ? 'active income-type' : ''}
                onClick={() => setType('INCOME')}
              >
                <Icon name="nordicIncome" size={19} />
                Entrada
              </button>
              <button
                type="button"
                className={type === 'EXPENSE' ? 'active expense-type' : ''}
                onClick={() => setType('EXPENSE')}
              >
                <Icon name="nordicExpense" size={19} />
                Saída
              </button>
            </div>

            <label>
              Descrição
              <input name="description" placeholder="Ex.: Salário, aluguel ou streaming" required />
            </label>
            <div className="form-grid">
              <label>
                Valor
                <input name="amount" type="number" min=".01" step=".01" required />
              </label>
              <label>
                Dia do mês
                <input name="day" type="number" min="1" max="28" required />
              </label>
            </div>
            <label>
              Categoria
              <select name="categoryId" key={type}>
                <option value="">Sem categoria</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="recurrence-projection-note">
              <Icon name="repeat" size={18} />
              <p>
                <strong>Previsão automática</strong>A recorrência será considerada na organização
                financeira de todo o mês.
              </p>
            </div>
            <button className="button recurrence-primary-action" disabled={saving}>
              {saving ? 'Criando ciclo...' : 'Confirmar recorrência'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
