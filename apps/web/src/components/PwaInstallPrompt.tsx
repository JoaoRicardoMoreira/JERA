'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISSED_AT_KEY = 'jera:pwa-install-dismissed-at';
const DISMISS_INTERVAL = 7 * 24 * 60 * 60 * 1000;

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

function isIosDevice() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (/macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  );
}

function isMobileDevice() {
  return navigator.maxTouchPoints > 0 || window.matchMedia('(max-width: 900px)').matches;
}

function recentlyDismissed() {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISSED_AT_KEY) || 0);
    return Date.now() - dismissedAt < DISMISS_INTERVAL;
  } catch {
    return false;
  }
}

export function PwaInstallPrompt() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed() || !isMobileDevice()) return;

    const isiOS = isIosDevice();
    setIos(isiOS);

    const showIosInstructions = window.setTimeout(() => {
      if (isiOS) setVisible(true);
    }, 1800);

    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', captureInstallPrompt);
    return () => {
      window.clearTimeout(showIosInstructions);
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    } catch {
      // O fechamento ainda funciona quando o armazenamento está indisponível.
    }
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallEvent(null);
      setVisible(false);
      return;
    }
    dismiss();
  };

  if (!visible || pathname === '/' || pathname === '/login' || pathname === '/offline') return null;

  return (
    <aside className="pwa-install-prompt" role="dialog" aria-labelledby="pwa-install-title">
      <button
        type="button"
        className="pwa-install-close"
        onClick={dismiss}
        aria-label="Lembrar da instalação depois"
      >
        ×
      </button>
      <span className="pwa-install-icon" aria-hidden="true" />
      <div className="pwa-install-copy">
        <span className="eyebrow">Leve sua jornada</span>
        <strong id="pwa-install-title">Instale o Jera no celular</strong>
        {ios ? (
          <p>
            Toque em <b>Compartilhar</b> e escolha <b>Adicionar à Tela de Início</b>.
          </p>
        ) : (
          <p>Abra sua jornada em tela cheia, direto pelo ícone do Jera.</p>
        )}
      </div>
      <div className="pwa-install-actions">
        {ios ? (
          <button type="button" className="pwa-install-primary" onClick={dismiss}>
            Entendi
          </button>
        ) : (
          <>
            <button type="button" className="pwa-install-later" onClick={dismiss}>
              Agora não
            </button>
            <button type="button" className="pwa-install-primary" onClick={install}>
              Instalar
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
