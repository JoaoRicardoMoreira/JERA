import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="offline-page">
      <section className="offline-card">
        <span className="offline-mark" aria-hidden="true" />
        <span className="eyebrow">A rota está encoberta</span>
        <h1>Você está sem conexão</h1>
        <p>
          Seus dados financeiros permanecem protegidos. Reconecte-se para consultar o ciclo ou
          registrar novos movimentos.
        </p>
        <Link href="/dashboard" className="button offline-retry">
          Tentar novamente
        </Link>
        <small>ᛃ O Jera continuará sua jornada assim que as águas se abrirem.</small>
      </section>
    </main>
  );
}
