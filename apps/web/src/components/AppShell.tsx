'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FinanceProvider } from './FinanceProvider';
import { Icon } from './Icon';
import { session } from '@/lib/api';

const links = [
  ['/dashboard', 'nordicDashboard', 'Dashboard', 'ᚨ'],
  ['/rendas', 'nordicIncome', 'Receitas', 'ᚠ'],
  ['/gastos', 'nordicExpense', 'Despesas', 'ᚾ'],
  ['/investimentos', 'nordicInvestment', 'Investimentos', 'ᛒ'],
  ['/metas', 'nordicGoals', 'Metas', 'ᛏ'],
  ['/orcamentos', 'nordicBudget', 'Orçamentos', 'ᛟ'],
  ['/recorrentes', 'nordicRepeat', 'Recorrências', 'ᛃ'],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (!session.get()) {
      router.replace('/login');
      return;
    }
    setSessionReady(true);
  }, [router]);

  if (!sessionReady) return <div className="app-boot" aria-label="Carregando" />;

  return (
    <FinanceProvider>
      <div className="shell">
        <button
          className={`mobile-menu icon-button ${open ? 'open' : ''}`}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen(!open)}
        >
          <Icon name="menu" />
        </button>
        <Link href="/dashboard" className="mobile-brand" aria-label="Ir para o Dashboard">
          <Image src="/brand/jera-mark-reference.png" alt="" width={28} height={28} priority />
          <span>Jera</span>
        </Link>
        {open && (
          <button
            className="sidebar-backdrop"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
        )}
        <aside className={open ? 'sidebar open' : 'sidebar'}>
          <div className="sidebar-rune-rail" aria-hidden="true">
            <span>ᚠ</span>
            <span>ᛃ</span>
            <span>ᛉ</span>
            <span>ᛟ</span>
          </div>
          <div className="brand">
            <span className="brand-mark">
              <Image src="/brand/jera-mark-reference.png" alt="" width={36} height={36} priority />
            </span>
            <div>
              <b>Jera</b>
              <small>Jornada financeira</small>
            </div>
          </div>
          <div className="sidebar-section-title" aria-hidden="true">
            <span>ᛃ</span>
            <small>Rotas da jornada</small>
          </div>
          <nav aria-label="Navegação principal">
            {links.map(([href, icon, label, rune]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={path === href ? 'active' : ''}
              >
                <span className="sidebar-nav-icon">
                  <Icon name={icon} size={19} />
                </span>
                <span>{label}</span>
                <i aria-hidden="true">{rune}</i>
              </Link>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="journey-mark">
              <span className="journey-rune">ᛃ</span>
              <div>
                <small>Runa Jera</small>
                <p>
                  Cada ciclo cultivado
                  <br />
                  prepara a próxima colheita.
                </p>
              </div>
            </div>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </FinanceProvider>
  );
}
