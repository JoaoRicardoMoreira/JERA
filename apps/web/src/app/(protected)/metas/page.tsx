'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageChrome } from '@/components/PageChrome';
import { useFinance } from '@/components/FinanceProvider';
import { date, money } from '@/lib/api';
import { FINANCIAL_GOAL_CATEGORIES, getFinancialGoalCategory } from '@/lib/financial-goals';
import type { FinancialGoal, FinancialGoalCategory } from '@/lib/types';

export default function GoalsPage() {
  const { data, createFinancialGoal, updateFinancialGoal, remove, valuesVisible } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinancialGoal | null>(null);
  const visibleMoney = (value: string) => (valuesVisible ? money(value) : 'R$ ••••••');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      name: String(form.get('name')),
      targetAmount: Number(form.get('targetAmount')),
      currentAmount: Number(form.get('currentAmount')),
      targetDate: String(form.get('targetDate') || '') || undefined,
      category: String(form.get('category')) as FinancialGoalCategory,
    };
    if (editing) await updateFinancialGoal(editing.id, input);
    else await createFinancialGoal(input);
    setOpen(false);
    setEditing(null);
  }

  return (
    <>
      <PageChrome
        title="Metas financeiras"
        subtitle="Grandes conquistas começam com um destino claro."
        action={
          <button
            className="button primary"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + Nova meta
          </button>
        }
      />
      <section className="content goals-page">
        <div className="page-intro">
          <span className="eyebrow">Sua jornada</span>
          <h1>Destinos financeiros</h1>
          <p>Acompanhe o patrimônio reservado para cada objetivo.</p>
        </div>
        <div className="goal-grid expanded">
          {data.financialGoals.map((goal) => {
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
                    <b>{visibleMoney(goal.currentAmount)}</b>
                  </span>
                  <span>
                    <small>Objetivo</small>
                    <b>{visibleMoney(goal.targetAmount)}</b>
                  </span>
                </div>
                <p>
                  {goal.status === 'COMPLETED'
                    ? 'Destino alcançado ✦'
                    : goal.targetDate
                      ? `Estimativa: ${date(goal.targetDate)}`
                      : `Faltam ${visibleMoney(goal.remainingAmount)}`}
                </p>
                <footer>
                  <button
                    onClick={() => {
                      setEditing(goal);
                      setOpen(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="danger-link"
                    onClick={() => confirm('Excluir esta meta?') && remove(`/goals/${goal.id}`)}
                  >
                    Excluir
                  </button>
                </footer>
              </article>
            );
          })}
          {!data.financialGoals.length && (
            <button className="goal-card new-goal" onClick={() => setOpen(true)}>
              <span>+</span>
              <h3>Crie sua primeira meta</h3>
              <p>Defina um valor e acompanhe seu avanço.</p>
            </button>
          )}
        </div>
      </section>
      {open && (
        <div
          className="overlay"
          onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <form className="modal" onSubmit={submit}>
            <button
              type="button"
              className="close"
              aria-label="Fechar"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <small>Próximo destino</small>
            <h2>{editing ? 'Editar meta' : 'Nova meta financeira'}</h2>
            <label>
              Categoria
              <select name="category" defaultValue={editing?.category ?? 'OTHER'} required>
                {FINANCIAL_GOAL_CATEGORIES.map((category) => (
                  <option value={category.value} key={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nome
              <input
                name="name"
                defaultValue={editing?.name}
                placeholder="Ex.: Apartamento"
                required
              />
            </label>
            <div className="form-grid">
              <label>
                Valor alvo
                <input
                  name="targetAmount"
                  type="number"
                  min=".01"
                  step=".01"
                  defaultValue={editing?.targetAmount}
                  required
                />
              </label>
              <label>
                Valor acumulado
                <input
                  name="currentAmount"
                  type="number"
                  min="0"
                  step=".01"
                  defaultValue={editing?.currentAmount || 0}
                  required
                />
              </label>
            </div>
            <label>
              Data desejada
              <input
                name="targetDate"
                type="date"
                defaultValue={editing?.targetDate?.slice(0, 10)}
              />
            </label>
            <button className="button primary">Salvar meta</button>
          </form>
        </div>
      )}
    </>
  );
}
