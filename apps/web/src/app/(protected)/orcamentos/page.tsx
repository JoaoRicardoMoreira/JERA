'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageChrome } from '@/components/PageChrome';
import { useFinance } from '@/components/FinanceProvider';
import { money } from '@/lib/api';
import type { Budget } from '@/lib/types';

type BudgetFilter = 'ALL' | 'ATTENTION' | 'EXCEEDED';

const hiddenValue = 'R$ ••••••';

export default function BudgetsPage() {
  const { data, upsertGoal, valuesVisible, month, year } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [filter, setFilter] = useState<BudgetFilter>('ALL');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const expenseCategories = data.categories.filter((category) => category.type === 'EXPENSE');
  const totalBudget = data.budgets.reduce((sum, budget) => sum + Number(budget.amount), 0);
  const totalSpent = data.budgets.reduce((sum, budget) => sum + Number(budget.spentAmount), 0);
  const totalRemaining = totalBudget - totalSpent;
  const globalProgress = totalBudget ? (totalSpent / totalBudget) * 100 : 0;
  const exceededCount = data.budgets.filter((budget) => budget.isExceeded).length;
  const visibleBudgets = useMemo(
    () =>
      data.budgets.filter((budget) => {
        if (filter === 'EXCEEDED') return budget.isExceeded;
        if (filter === 'ATTENTION') return !budget.isExceeded && budget.progressPercentage >= 80;
        return true;
      }),
    [data.budgets, filter],
  );
  const showMoney = (value: string | number) => (valuesVisible ? money(value) : hiddenValue);

  function openCreate() {
    setEditing(null);
    setNotice('');
    setOpen(true);
  }

  function openEdit(budget: Budget) {
    setEditing(budget);
    setNotice('');
    setOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);

    try {
      await upsertGoal(String(form.get('categoryId')), Number(form.get('amount')));
      setOpen(false);
      setEditing(null);
      setNotice('Orçamento atualizado para a competência selecionada.');
    } catch {
      setNotice('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageChrome
        title="Orçamentos"
        subtitle="Distribua seus recursos com intenção e proteja cada parte da jornada."
        action={
          <button className="button budget-primary-action" onClick={openCreate}>
            + Novo orçamento
          </button>
        }
      />

      <section className="content budgets-v2-page">
        {notice && (
          <div className="budget-notice" role="status">
            <Icon name="check" size={15} />
            {notice}
          </div>
        )}

        <section className="budget-hero">
          <div className="budget-hero-art" aria-hidden="true">
            <Image
              src="/brand/jera-card-wealth.jpg"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 80vw"
              alt=""
            />
          </div>
          <div className="budget-hero-copy">
            <span className="eyebrow">Recursos protegidos</span>
            <h1>{showMoney(totalBudget)}</h1>
            <p>Cada limite define um território seguro para suas escolhas durante a competência.</p>
            <div className="budget-hero-metrics">
              <span>
                <small>Utilizado</small>
                <strong>{showMoney(totalSpent)}</strong>
              </span>
              <span>
                <small>Disponível</small>
                <strong className={totalRemaining >= 0 ? 'income' : 'expense'}>
                  {showMoney(totalRemaining)}
                </strong>
              </span>
              <span>
                <small>Consumo geral</small>
                <strong className={globalProgress > 100 ? 'expense' : ''}>
                  {globalProgress.toFixed(0)}%
                </strong>
              </span>
              <span>
                <small>Limites excedidos</small>
                <strong className={exceededCount ? 'expense' : ''}>{exceededCount}</strong>
              </span>
            </div>
          </div>
        </section>

        <section className="budget-territories">
          <header>
            <div>
              <span className="eyebrow">Mapa de distribuição</span>
              <h2>Orçamentos por categoria</h2>
              <p>
                Competência selecionada: {String(month).padStart(2, '0')}/{year}
              </p>
            </div>
            <div className="budget-filters" aria-label="Filtrar orçamentos">
              {[
                ['ALL', 'Todos'],
                ['ATTENTION', 'Atenção'],
                ['EXCEEDED', 'Excedidos'],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={filter === value ? 'active' : ''}
                  onClick={() => setFilter(value as BudgetFilter)}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          {visibleBudgets.length ? (
            <div className="budget-territory-grid">
              {visibleBudgets.map((budget) => {
                const state = budget.isExceeded
                  ? 'exceeded'
                  : budget.progressPercentage >= 80
                    ? 'attention'
                    : 'safe';
                const available = Number(budget.amount) - Number(budget.spentAmount);
                return (
                  <article className={`budget-territory-card ${state}`} key={budget.id}>
                    <div className="budget-card-heading">
                      <span className="budget-rune">
                        <Icon name="nordicBudget" size={20} />
                      </span>
                      <span className="budget-state">
                        {state === 'exceeded'
                          ? 'Excedido'
                          : state === 'attention'
                            ? 'Atenção'
                            : 'Protegido'}
                      </span>
                    </div>
                    <div className="budget-card-title">
                      <div>
                        <small>Categoria</small>
                        <h3>{budget.categoryName}</h3>
                      </div>
                      <strong>{budget.progressPercentage.toFixed(0)}%</strong>
                    </div>
                    <div className="budget-progress">
                      <i style={{ width: `${Math.min(budget.progressPercentage, 100)}%` }} />
                    </div>
                    <div className="budget-card-values">
                      <span>
                        <small>Utilizado</small>
                        <strong>{showMoney(budget.spentAmount)}</strong>
                      </span>
                      <span>
                        <small>Limite</small>
                        <strong>{showMoney(budget.amount)}</strong>
                      </span>
                    </div>
                    <div className="budget-card-footer">
                      <span className={available >= 0 ? '' : 'expense'}>
                        {available >= 0
                          ? `${showMoney(available)} disponíveis`
                          : `${showMoney(Math.abs(available))} acima do limite`}
                      </span>
                      <button onClick={() => openEdit(budget)}>Editar limite</button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="budget-empty">
              <span>ᛟ</span>
              <h3>
                {data.budgets.length
                  ? 'Nenhum orçamento encontrado neste filtro.'
                  : 'Nenhum território protegido nesta competência.'}
              </h3>
              <p>
                Defina limites por categoria para acompanhar os gastos antes que eles ultrapassem
                sua rota planejada.
              </p>
              {!data.budgets.length && (
                <button className="button budget-primary-action" onClick={openCreate}>
                  Criar primeiro orçamento
                </button>
              )}
            </div>
          )}
        </section>
      </section>

      {open && (
        <div className="overlay" role="presentation" onMouseDown={() => setOpen(false)}>
          <form
            className="modal budget-modal"
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
            <span className="eyebrow">Proteção mensal</span>
            <h2>{editing ? 'Editar orçamento' : 'Novo orçamento'}</h2>
            <p className="budget-modal-intro">
              Defina quanto pode ser utilizado nesta categoria durante a competência selecionada.
            </p>
            <label>
              Categoria
              <select
                name="categoryId"
                defaultValue={editing?.categoryId || ''}
                disabled={Boolean(editing)}
                required
              >
                <option value="">Selecione uma categoria</option>
                {expenseCategories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {editing && <input type="hidden" name="categoryId" value={editing.categoryId} />}
            </label>
            <label>
              Limite mensal
              <input
                name="amount"
                type="number"
                min=".01"
                step=".01"
                defaultValue={editing?.amount}
                required
                autoFocus
              />
            </label>
            <div className="budget-protection-note">
              <span>ᛟ</span>
              <p>
                <strong>Runa Othala</strong>
                Representa patrimônio, território e a proteção dos recursos conquistados.
              </p>
            </div>
            <button className="button budget-primary-action" disabled={saving}>
              {saving ? 'Protegendo recursos...' : 'Salvar orçamento'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
