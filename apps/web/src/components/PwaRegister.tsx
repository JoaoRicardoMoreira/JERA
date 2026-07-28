'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        await registration.update();
      } catch {
        // A aplicação continua funcional mesmo quando o navegador bloqueia service workers.
      }
    };

    window.addEventListener('load', register);
    if (document.readyState === 'complete') void register();

    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
