'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FinanceProvider } from './FinanceProvider';
import { session } from '@/lib/api';
const links = [
  ['/dashboard', '▦', 'Visao geral'],
  ['/rendas', '↑', 'Rendas'],
  ['/gastos', '↓', 'Gastos'],
  ['/recorrentes', '↻', 'Recorrentes'],
  ['/investimentos', '▥', 'Investimentos'],
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

  if (!sessionReady) return null;

  return (
    <FinanceProvider>
      <div className="shell">
        <button className="mobile-menu button secondary" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <aside className={open ? 'sidebar open' : 'sidebar'}>
          <div className="brand">
            <Image src="/brand/jera-mark-reference.png" alt="Jera" width={34} height={34} />
            <b>Jera</b>
          </div>
          <nav>
            {links.map(([href, icon, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={path === href ? 'active' : ''}
              >
                <i>{icon}</i>
                {label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-foot">
            <Link href="/configuracoes" className={path === '/configuracoes' ? 'active' : ''}>
              ● Configuracoes
            </Link>
            <button
              onClick={() => {
                session.clear();
                router.push('/login');
              }}
            >
              Sair
            </button>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </FinanceProvider>
  );
}
