'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { PageChrome } from '@/components/PageChrome';
import { UserAvatar } from '@/components/UserAvatar';
import { api, date, session } from '@/lib/api';
import type { Gender, UserProfile } from '@/lib/types';

const genders: Array<{ value: Gender; label: string }> = [
  { value: 'FEMALE', label: 'Feminino' },
  { value: 'MALE', label: 'Masculino' },
  { value: 'NON_BINARY', label: 'Não binário' },
  { value: 'OTHER', label: 'Outro' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefiro não informar' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api<UserProfile>('/users/me')
      .then(setProfile)
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : 'Não foi possível carregar o perfil.'),
      )
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    const form = new FormData(event.currentTarget);
    const nullable = (name: string) => String(form.get(name) || '').trim() || null;

    try {
      const updated = await api<UserProfile>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name: String(form.get('name')).trim(),
          birthDate: nullable('birthDate'),
          gender: nullable('gender'),
          phone: nullable('phone'),
          occupation: nullable('occupation'),
          city: nullable('city'),
          state: nullable('state'),
          bio: nullable('bio'),
        }),
      });
      setProfile(updated);
      const current = session.get();
      if (current) {
        session.set({
          ...current,
          user: { name: updated.name, email: updated.email, gender: updated.gender },
        });
      }
      window.dispatchEvent(
        new CustomEvent<Gender | null>('profile-gender-updated', { detail: updated.gender }),
      );
      setMessage('Seu perfil foi atualizado.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    const current = session.get();
    try {
      if (current?.refreshToken) {
        await api('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: current.refreshToken }),
        });
      }
    } finally {
      session.clear();
      router.push('/login');
    }
  }

  const location = [profile?.city, profile?.state].filter(Boolean).join(', ');

  return (
    <>
      <PageChrome
        title="Perfil"
        subtitle="Sua identidade, sua história e o caminho que você está construindo."
      />

      <section className="content profile-page">
        {error && <div className="error">{error}</div>}
        {message && (
          <div className="profile-notice" role="status">
            <Icon name="check" size={15} />
            {message}
          </div>
        )}

        <section className="profile-hero">
          <div className="profile-hero-art" aria-hidden="true">
            <Image
              src="/brand/jera-wolf-insight.png"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 80vw"
              alt=""
            />
          </div>
          <div className="profile-hero-copy">
            <span className="eyebrow">Viajante da Jera</span>
            <div className="profile-identity">
              <UserAvatar name={profile?.name} gender={profile?.gender} large />
              <div>
                <h1>{profile?.name || 'Seu perfil'}</h1>
                <p>{profile?.occupation || 'Construindo uma jornada financeira consciente'}</p>
              </div>
            </div>
            <div className="profile-hero-details">
              <span>
                <small>E-mail</small>
                <strong>{profile?.email || '—'}</strong>
              </span>
              <span>
                <small>Idade</small>
                <strong>
                  {profile?.age !== null && profile?.age !== undefined
                    ? `${profile.age} anos`
                    : '—'}
                </strong>
              </span>
              <span>
                <small>Localização</small>
                <strong>{location || '—'}</strong>
              </span>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="profile-loading">Carregando sua jornada...</div>
        ) : profile ? (
          <div className="profile-layout">
            <form className="profile-form-panel" onSubmit={submit}>
              <header>
                <div>
                  <span className="eyebrow">Identidade pessoal</span>
                  <h2>Sobre você</h2>
                </div>
                <span className="profile-form-rune" aria-hidden="true">
                  ᛗ
                </span>
              </header>

              <div className="profile-form-grid">
                <label>
                  Nome completo
                  <input name="name" defaultValue={profile.name} minLength={2} required />
                </label>
                <label>
                  E-mail de acesso
                  <input value={profile.email} disabled />
                  <small>O e-mail não pode ser alterado pelo perfil.</small>
                </label>
                <label>
                  Data de nascimento
                  <input name="birthDate" type="date" defaultValue={profile.birthDate || ''} />
                </label>
                <label>
                  Sexo
                  <select name="gender" defaultValue={profile.gender || ''}>
                    <option value="">Não informado</option>
                    {genders.map((gender) => (
                      <option value={gender.value} key={gender.value}>
                        {gender.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Telefone
                  <input
                    name="phone"
                    defaultValue={profile.phone || ''}
                    placeholder="+55 11 99999-9999"
                  />
                </label>
                <label>
                  Profissão
                  <input
                    name="occupation"
                    defaultValue={profile.occupation || ''}
                    placeholder="Ex.: Desenvolvedor de software"
                  />
                </label>
                <label>
                  Cidade
                  <input name="city" defaultValue={profile.city || ''} />
                </label>
                <label>
                  Estado
                  <input name="state" defaultValue={profile.state || ''} />
                </label>
                <label className="profile-bio-field">
                  Sobre sua jornada
                  <textarea
                    name="bio"
                    maxLength={500}
                    defaultValue={profile.bio || ''}
                    placeholder="Conte um pouco sobre você e seus objetivos."
                  />
                </label>
              </div>

              <footer>
                <span>Seus dados pessoais ficam vinculados somente à sua conta.</span>
                <button className="button profile-save-action" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar perfil'}
                </button>
              </footer>
            </form>

            <aside className="profile-journey-panel">
              <span className="profile-journey-rune">ᛃ</span>
              <small>Sua jornada na Jera</small>
              <h2>Cada informação ajuda a tornar sua experiência mais pessoal e significativa.</h2>
              <div>
                <span>
                  <small>Membro desde</small>
                  <strong>{date(profile.createdAt)}</strong>
                </span>
                <span>
                  <small>Perfil</small>
                  <strong>{profile.roles.includes('ADMIN') ? 'Administrador' : 'Viajante'}</strong>
                </span>
              </div>
              {profile.bio && <blockquote>“{profile.bio}”</blockquote>}
              <button className="profile-logout" onClick={logout}>
                Sair da conta
              </button>
            </aside>
          </div>
        ) : null}
      </section>
    </>
  );
}
