'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useFinance } from '@/components/FinanceProvider';
import { PageChrome } from '@/components/PageChrome';
import { getSettlementHotspots } from '@/components/settlement/settlementHotspots';
import { api, money } from '@/lib/api';
import type { SettlementOverview } from '@/lib/types';

const hiddenValue = 'R$ ••••••';

const districtRunes: Record<string, string> = {
  GREAT_HALL: 'ᛟ',
  GRANARY: 'ᛃ',
  HARBOR: 'ᛉ',
  MARKET: 'ᚠ',
  PALISADE: 'ᛇ',
  HALL_OF_ACHIEVEMENTS: 'ᛏ',
  LIGHTHOUSE: 'ᛋ',
};

const districtDetails: Record<string, { guidance: string; href: string; action: string }> = {
  GREAT_HALL: {
    guidance: 'Cresce quando seu patrimônio avança de forma consistente.',
    href: '/dashboard',
    action: 'Ver patrimônio',
  },
  GRANARY: {
    guidance: 'Fortaleça sua reserva de emergência e faça novos aportes nela.',
    href: '/metas',
    action: 'Cuidar da reserva',
  },
  HARBOR: {
    guidance: 'Evolui com seus investimentos e com os aportes realizados.',
    href: '/investimentos',
    action: 'Ver investimentos',
  },
  MARKET: {
    guidance: 'Prospera quando suas receitas permanecem constantes ao longo dos ciclos.',
    href: '/rendas',
    action: 'Ver receitas',
  },
  PALISADE: {
    guidance: 'Torna-se mais resistente quando você respeita os orçamentos planejados.',
    href: '/orcamentos',
    action: 'Ver orçamentos',
  },
  HALL_OF_ACHIEVEMENTS: {
    guidance: 'Guarda o progresso das suas metas e celebra cada objetivo concluído.',
    href: '/metas',
    action: 'Ver metas',
  },
  LIGHTHOUSE: {
    guidance: 'Ganha força quando seus compromissos e recorrências permanecem organizados.',
    href: '/recorrentes',
    action: 'Ver recorrências',
  },
};

function journeyValue(journey: SettlementOverview['journeys'][number], valuesVisible: boolean) {
  if (journey.unit === 'COUNT') {
    return `${Math.min(Number(journey.currentValue), Number(journey.targetValue))} de ${Number(
      journey.targetValue,
    )}`;
  }
  if (!valuesVisible) return hiddenValue;
  return `${money(journey.currentValue)} de ${money(journey.targetValue)}`;
}

export default function SettlementPage() {
  const { valuesVisible } = useFinance();
  const [overview, setOverview] = useState<SettlementOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDistrictKey, setSelectedDistrictKey] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api<SettlementOverview>('/settlement/overview')
      .then((response) => {
        if (active) setOverview(response);
      })
      .catch((reason) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : 'Não foi possível visitar a aldeia.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedDistrictKey) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedDistrictKey(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedDistrictKey]);

  const showMoney = (value: string | number) => (valuesVisible ? money(value) : hiddenValue);
  const selectedDistrict =
    overview?.districts.find((district) => district.key === selectedDistrictKey) ?? null;
  const selectedDistrictDetails = selectedDistrict
    ? districtDetails[selectedDistrict.key]
    : undefined;

  return (
    <div className="settlement-page settlement-world-page">
      <PageChrome
        title="Meu Assentamento"
        subtitle="Sua jornada financeira transformada em um lugar que cresce com você."
        showPeriodControls={false}
      />

      {loading && (
        <div className="settlement-loading" aria-label="Reconstruindo seu assentamento">
          <span>ᛃ</span>
          <strong>Reconstruindo sua jornada...</strong>
          <small>Cada registro ajuda a erguer a aldeia.</small>
        </div>
      )}

      {error && (
        <div className="error settlement-error" role="alert">
          {error}
        </div>
      )}

      {overview && (
        <section
          className={`settlement-hero settlement-world settlement-atmosphere-${overview.atmosphere.state.toLowerCase()}`}
        >
          <div className="settlement-world-scene">
            <Image
              src={`/brand/settlement/jera-settlement-${overview.stage.assetKey}.png`}
              alt={`Panorama do assentamento no estágio ${overview.stage.label}`}
              fill
              sizes="(max-width: 800px) 140vw, 1480px"
              quality={95}
              priority
            />
            <div className="settlement-weather" aria-hidden="true" />
            <div className="settlement-hero-shade" aria-hidden="true" />
            <div className="settlement-structure-layer">
              {getSettlementHotspots(overview.stage.assetKey).map((hotspot) => {
                const district = overview.districts.find(({ key }) => key === hotspot.key);

                return (
                  <button
                    key={hotspot.key}
                    type="button"
                    className="settlement-structure-hitbox"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      width: `${hotspot.width}%`,
                      height: `${hotspot.height}%`,
                    }}
                    onClick={() => setSelectedDistrictKey(hotspot.key)}
                    aria-label={`Abrir ${district?.label ?? 'estrutura do assentamento'}`}
                  />
                );
              })}
            </div>
          </div>

          <article className="settlement-world-status">
            <span className="eyebrow">Seu domínio no Norte</span>
            <h1>{overview.stage.label}</h1>
            <div className="settlement-world-patrimony">
              <div>
                <small>Patrimônio acompanhado</small>
                <strong>{showMoney(overview.patrimony)}</strong>
              </div>
              <span
                className={`settlement-delta ${
                  Number(overview.patrimonyDelta) >= 0 ? 'positive' : 'negative'
                }`}
              >
                {Number(overview.patrimonyDelta) >= 0 ? '↗' : '↘'}{' '}
                {valuesVisible ? money(Math.abs(Number(overview.patrimonyDelta))) : hiddenValue}
              </span>
            </div>
            <div className="settlement-stage-progress">
              <div>
                <span style={{ width: `${overview.stage.progressPercentage}%` }} />
              </div>
              <small>
                {overview.stage.progressPercentage.toFixed(0)}% · {overview.nextExpansion}
              </small>
            </div>
            <dl className="settlement-world-resources">
              <div>
                <dt>Saldo</dt>
                <dd>{showMoney(overview.availableBalance)}</dd>
              </div>
              <div>
                <dt>Porto</dt>
                <dd>{showMoney(overview.investmentValue)}</dd>
              </div>
              <div>
                <dt>Metas</dt>
                <dd>{showMoney(overview.goalReserveValue)}</dd>
              </div>
            </dl>
          </article>

          <aside className="settlement-world-guide">
            <div className="settlement-guide-avatar">
              <Image
                src="/brand/jera-wolf-insight.png"
                alt="Fenrir"
                fill
                sizes="(max-width: 800px) 112px, 160px"
                quality={92}
              />
            </div>
            <div>
              <span className="eyebrow">Fenrir observa</span>
              <p>{overview.fenrirMessage}</p>
              <small>
                <b>{overview.atmosphere.state === 'ATTENTION' ? 'ᛇ' : 'ᛃ'}</b>{' '}
                {overview.atmosphere.reason}
              </small>
            </div>
          </aside>

          {selectedDistrict && selectedDistrictDetails && (
            <>
              <button
                type="button"
                className="settlement-district-backdrop"
                onClick={() => setSelectedDistrictKey(null)}
                aria-label="Fechar detalhes da estrutura"
              />
              <aside
                className="settlement-district-panel"
                role="dialog"
                aria-modal="false"
                aria-labelledby="settlement-district-title"
              >
                <header>
                  <span className="settlement-district-panel-rune">
                    {districtRunes[selectedDistrict.key] ?? 'ᛃ'}
                  </span>
                  <div>
                    <small>Distrito do assentamento</small>
                    <h2 id="settlement-district-title">{selectedDistrict.label}</h2>
                  </div>
                  <button
                    type="button"
                    className="settlement-district-close"
                    onClick={() => setSelectedDistrictKey(null)}
                    aria-label="Fechar"
                  >
                    ×
                  </button>
                </header>
                <p>{selectedDistrict.description}</p>
                <div className="settlement-district-level">
                  <div>
                    <span>Nível atual</span>
                    <strong>{selectedDistrict.level} de 5</strong>
                  </div>
                  <em>
                    {selectedDistrict.level === 5
                      ? 'Estrutura completa'
                      : `${selectedDistrict.progressPercentage.toFixed(0)}% para o próximo nível`}
                  </em>
                </div>
                <div
                  className="settlement-district-panel-progress"
                  aria-label={`${selectedDistrict.progressPercentage}%`}
                >
                  <span style={{ width: `${selectedDistrict.progressPercentage}%` }} />
                </div>
                <div className="settlement-district-guidance">
                  <span>ᚱ</span>
                  <div>
                    <small>Como fortalecer</small>
                    <p>{selectedDistrictDetails.guidance}</p>
                  </div>
                </div>
                <Link href={selectedDistrictDetails.href} className="settlement-district-action">
                  {selectedDistrictDetails.action}
                  <span aria-hidden="true">→</span>
                </Link>
              </aside>
            </>
          )}

          <div className="settlement-world-dock">
            <details className="settlement-drawer" name="settlement-panels">
              <summary>
                <span className="settlement-drawer-rune">ᛃ</span>
                <span>
                  <small>Ciclo atual</small>
                  <strong>Jornadas</strong>
                </span>
                <em>{overview.journeys.length}</em>
                <i aria-hidden="true">⌃</i>
              </summary>
              <div className="settlement-drawer-content">
                <header>
                  <div>
                    <span className="eyebrow">Jornadas do ciclo</span>
                    <h2>Pequenos passos, novas construções</h2>
                  </div>
                  <small>Geradas automaticamente</small>
                </header>
                <div className="settlement-journeys">
                  {overview.journeys.map((journey) => (
                    <article
                      key={journey.id}
                      className={`${journey.isPrimary ? 'primary' : ''} ${
                        journey.status === 'COMPLETED' ? 'completed' : ''
                      }`}
                    >
                      <div className="journey-rune">
                        {journey.status === 'COMPLETED' ? '✓' : journey.isPrimary ? 'ᛃ' : 'ᚱ'}
                      </div>
                      <div className="journey-copy">
                        <span>{journey.isPrimary ? 'Jornada principal' : 'Oportunidade'}</span>
                        <h3>{journey.title}</h3>
                        <p>{journey.description}</p>
                      </div>
                      <div className="journey-progress">
                        <strong>
                          {journey.status === 'COMPLETED'
                            ? 'Concluída'
                            : journeyValue(journey, valuesVisible)}
                        </strong>
                        <div>
                          <span style={{ width: `${journey.progressPercentage}%` }} />
                        </div>
                        <small>{journey.progressPercentage.toFixed(0)}%</small>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </details>

            <details className="settlement-drawer" name="settlement-panels">
              <summary>
                <span className="settlement-drawer-rune">ᛟ</span>
                <span>
                  <small>Progresso permanente</small>
                  <strong>Distritos</strong>
                </span>
                <em>{overview.districts.length}</em>
                <i aria-hidden="true">⌃</i>
              </summary>
              <div className="settlement-drawer-content settlement-district-drawer">
                <header>
                  <div>
                    <span className="eyebrow">Runas do assentamento</span>
                    <h2>Cada distrito conta uma parte da sua história</h2>
                  </div>
                  <small>O progresso conquistado não regride</small>
                </header>
                <div className="settlement-districts">
                  {overview.districts.map((district) => (
                    <article key={district.key}>
                      <div className="district-rune">{districtRunes[district.key] ?? 'ᛃ'}</div>
                      <div>
                        <span>Nível {district.level} de 5</span>
                        <h3>{district.label}</h3>
                        <p>{district.description}</p>
                      </div>
                      <div
                        className="district-progress"
                        aria-label={`${district.progressPercentage}%`}
                      >
                        <span style={{ width: `${district.progressPercentage}%` }} />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </section>
      )}
    </div>
  );
}
