'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { useFinance } from './FinanceProvider';
import { UserAvatar } from './UserAvatar';
import { api, session } from '@/lib/api';
import type { Gender, UserProfile } from '@/lib/types';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
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

export function PageChrome({
  title,
  subtitle,
  action,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const { month, year, setPeriod, loading, error, valuesVisible, toggleValues, data } =
    useFinance();
  const user = session.get()?.user;
  const firstName = user?.name?.split(' ')[0] || 'viajante';
  const [gender, setGender] = useState<Gender | null>(user?.gender ?? null);
  const notifications = data.payables.filter(
    (item) => item.status === 'OVERDUE' || (item.status === 'PENDING' && item.daysUntilDue <= 3),
  ).length;

  useEffect(() => {
    let active = true;

    api<UserProfile>('/users/me')
      .then((profile) => {
        if (!active) return;
        setGender(profile.gender);
        const current = session.get();
        if (current) {
          session.set({
            ...current,
            user: { name: profile.name, email: profile.email, gender: profile.gender },
          });
        }
      })
      .catch(() => undefined);

    const updateGender = (event: Event) => {
      setGender((event as CustomEvent<Gender | null>).detail);
    };
    window.addEventListener('profile-gender-updated', updateGender);

    return () => {
      active = false;
      window.removeEventListener('profile-gender-updated', updateGender);
    };
  }, []);

  return (
    <>
      <header className={`page-header ${title ? '' : 'dashboard-page-header'}`}>
        <div className="header-copy">
          {title ? (
            <small>{title}</small>
          ) : (
            <div className="dashboard-welcome">
              <span className="welcome-rune" aria-hidden="true">
                ᛃ
              </span>
              <div>
                <small>Bem-vindo à sua jornada</small>
                <strong>Olá, {firstName}</strong>
              </div>
            </div>
          )}
          <p>
            {subtitle || 'Cultive boas escolhas hoje. O próximo horizonte nasce a cada novo ciclo.'}
          </p>
        </div>
        <div className="header-actions">
          <label className="period-select">
            <span className="sr-only">Mês</span>
            <select value={month} onChange={(event) => setPeriod(Number(event.target.value), year)}>
              {months.map((label, index) => (
                <option value={index + 1} key={label}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <input
            aria-label="Ano"
            type="number"
            min="2000"
            max="2100"
            value={year}
            onChange={(event) => setPeriod(month, Number(event.target.value))}
          />
          <button
            className="icon-button"
            onClick={toggleValues}
            title={valuesVisible ? 'Ocultar valores' : 'Mostrar valores'}
            aria-label={valuesVisible ? 'Ocultar valores' : 'Mostrar valores'}
          >
            <Icon name={valuesVisible ? 'eye' : 'eyeOff'} />
          </button>
          <button
            className="icon-button notification"
            title="Notificações"
            aria-label={`${notifications} notificações`}
          >
            <Icon name="bell" />
            {notifications > 0 && <b>{notifications}</b>}
          </button>
          <Link
            href="/perfil"
            className="avatar"
            title={user?.name || 'Perfil'}
            aria-label="Perfil"
          >
            <UserAvatar name={user?.name} gender={gender} />
          </Link>
          {action && <div className="quick-actions">{action}</div>}
        </div>
      </header>
      {loading && <div className="loading" />}
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
    </>
  );
}
