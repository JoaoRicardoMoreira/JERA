'use client';
import { useRouter } from 'next/navigation';
import { api, session } from '@/lib/api';
import { PageChrome } from '@/components/PageChrome';
export default function Page() {
  const router = useRouter();
  async function logout() {
    const current = session.get();
    try {
      if (current?.refreshToken)
        await api('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: current.refreshToken }),
        });
    } finally {
      session.clear();
      router.push('/login');
    }
  }
  return (
    <>
      <PageChrome title="Configuracoes" />
      <section className="content narrow">
        <div className="card">
          <small>Sessao</small>
          <h2>Conta e acesso</h2>
          <p className="muted">Gerencie sua sessao atual no FinanceControl.</p>
          <button className="button danger" onClick={logout}>
            Sair da conta
          </button>
        </div>
      </section>
    </>
  );
}
