'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { Icon } from '@/components/Icon';
import { PageChrome } from '@/components/PageChrome';
import { useFinance } from '@/components/FinanceProvider';
import { api, date, money } from '@/lib/api';
import { FINANCIAL_GOAL_CATEGORIES, getFinancialGoalCategory } from '@/lib/financial-goals';
import type { FinancialGoal, FinancialGoalCategory, FinancialGoalContribution } from '@/lib/types';

export default function GoalsPage() {
  const {
    data,
    createFinancialGoal,
    updateFinancialGoal,
    contributeToFinancialGoal,
    remove,
    valuesVisible,
  } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinancialGoal | null>(null);
  const [contributing, setContributing] = useState<FinancialGoal | null>(null);
  const [contributions, setContributions] = useState<FinancialGoalContribution[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [contributionError, setContributionError] = useState('');
  const visibleMoney = (value: string) => (valuesVisible ? money(value) : 'R$ ••••••');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      name: String(form.get('name')),
      targetAmount: Number(form.get('targetAmount')),
      targetDate: String(form.get('targetDate') || '') || undefined,
      category: String(form.get('category')) as FinancialGoalCategory,
    };
    if (editing) await updateFinancialGoal(editing.id, input);
    else await createFinancialGoal(input);
    setOpen(false);
    setEditing(null);
  }

  async function openContribution(goal: FinancialGoal) {
    setContributing(goal);
    setHistoryLoading(true);
    setContributionError('');
    try {
      setContributions(await api<FinancialGoalContribution[]>(`/goals/${goal.id}/contributions`));
    } catch (reason) {
      setContributions([]);
      setContributionError(
        reason instanceof Error ? reason.message : 'Não foi possível consultar os aportes.',
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  async function submitContribution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contributing) return;
    const form = new FormData(event.currentTarget);
    setContributionError('');
    try {
      await contributeToFinancialGoal(
        contributing.id,
        Number(form.get('amount')),
        String(form.get('contributedAt')),
      );
      setContributing(null);
      setContributions([]);
    } catch (reason) {
      setContributionError(
        reason instanceof Error ? reason.message : 'Não foi possível registrar o aporte.',
      );
    }
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
                  {goal.status !== 'COMPLETED' && (
                    <button
                      className="goal-contribute-action"
                      onClick={() => openContribution(goal)}
                    >
                      <Icon name="plus" size={13} />
                      Aportar
                    </button>
                  )}
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
            <button className="goal-card new-goal new-goal-themed" onClick={() => setOpen(true)}>
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
      {contributing && (
        <div
          className="overlay"
          onMouseDown={(event) => event.target === event.currentTarget && setContributing(null)}
        >
          <form className="modal goal-contribution-modal" onSubmit={submitContribution}>
            <button
              type="button"
              className="close"
              aria-label="Fechar"
              onClick={() => setContributing(null)}
            >
              ×
            </button>
            <small>Aporte de jornada</small>
            <h2>{contributing.name}</h2>
            <div className="contribution-summary">
              <span>
                <small>Acumulado</small>
                <strong>{visibleMoney(contributing.currentAmount)}</strong>
              </span>
              <span>
                <small>Falta conquistar</small>
                <strong>{visibleMoney(contributing.remainingAmount)}</strong>
              </span>
            </div>
            <div className="form-grid">
              <label>
                Valor do aporte
                <input
                  name="amount"
                  type="number"
                  min=".01"
                  max={contributing.remainingAmount}
                  step=".01"
                  placeholder="R$ 0,00"
                  autoFocus
                  required
                />
              </label>
              <label>
                Data do aporte
                <input
                  name="contributedAt"
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  required
                />
              </label>
            </div>
            <div className="contribution-balance-note">
              <Icon name="nordicGoals" size={17} />
              Este valor será reservado e debitado do saldo disponível no mês da data informada.
            </div>
            {contributionError && <div className="error">{contributionError}</div>}
            <button className="button primary">Confirmar aporte</button>
            <section className="contribution-history">
              <header>
                <span className="eyebrow">Histórico</span>
                <small>{contributions.length} aportes</small>
              </header>
              {historyLoading ? (
                <p>Consultando registros...</p>
              ) : contributions.length ? (
                contributions.map((contribution) => (
                  <div key={contribution.id}>
                    <span>
                      <Icon name="check" size={13} />
                      {date(contribution.contributedAt)}
                    </span>
                    <strong>+ {visibleMoney(contribution.amount)}</strong>
                  </div>
                ))
              ) : (
                <p>Esta meta ainda não recebeu aportes registrados.</p>
              )}
            </section>
          </form>
        </div>
      )}
    </>
  );
}
