import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jera FinanceControl',
  description: 'Controle financeiro pessoal',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
