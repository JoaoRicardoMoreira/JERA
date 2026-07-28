import type { Metadata, Viewport } from 'next';

import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';
import { PwaRegister } from '@/components/PwaRegister';

import './globals.css';

export const metadata: Metadata = {
  applicationName: 'Jera',
  title: {
    default: 'Jera — Jornada Financeira',
    template: '%s | Jera',
  },
  description:
    'Organize suas finanças, acompanhe seus ciclos e desenvolva seu assentamento viking.',
  appleWebApp: {
    capable: true,
    title: 'Jera',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#071311',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <PwaRegister />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
