'use client';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, session } from '@/lib/api';
export default function Login() {
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (session.get()) router.replace('/dashboard');
  }, [router]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    try {
      const result = await api<{
        accessToken: string;
        refreshToken: string;
        user: { name: string; email: string };
      }>(register ? '/auth/register' : '/auth/login', {
        method: 'POST',
        body: JSON.stringify(
          register
            ? { name: fd.get('name'), email: fd.get('email'), password: fd.get('password') }
            : { email: fd.get('email'), password: fd.get('password') },
        ),
      });
      session.set(result);
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao entrar.');
      setBusy(false);
    }
  }
  return (
    <main className="login">
      <form className="login-card" onSubmit={submit}>
        <Image src="/brand/jera-logo-reference.png" alt="Jera" width={132} height={48} />
        <small>FinanceControl</small>
        <h1>{register ? 'Crie sua conta' : 'Bem-vindo de volta'}</h1>
        <p>Controle financeiro preciso, simples e seguro.</p>
        {error && <div className="error">{error}</div>}
        {register && (
          <label>
            Nome
            <input name="name" autoComplete="name" required />
          </label>
        )}
        <label>
          E-mail
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Senha
          <input
            name="password"
            type="password"
            minLength={8}
            autoComplete={register ? 'new-password' : 'current-password'}
            required
          />
        </label>
        <button className="button primary" disabled={busy}>
          {busy ? 'Aguarde...' : register ? 'Criar conta' : 'Entrar'}
        </button>
        <button type="button" className="text-button" onClick={() => setRegister(!register)}>
          {register ? 'Ja tenho uma conta' : 'Criar uma conta'}
        </button>
      </form>
    </main>
  );
}
