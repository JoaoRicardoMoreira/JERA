import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Jera — Jornada Financeira',
    short_name: 'Jera',
    description:
      'Organize suas finanças, acompanhe seus ciclos e desenvolva seu assentamento viking.',
    lang: 'pt-BR',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#06110f',
    theme_color: '#071311',
    categories: ['finance', 'productivity'],
    icons: [
      {
        src: '/pwa/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Abrir sua visão financeira',
        url: '/dashboard',
        icons: [{ src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Meu Assentamento',
        short_name: 'Assentamento',
        description: 'Visitar seu assentamento',
        url: '/assentamento',
        icons: [{ src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Meu Ciclo',
        short_name: 'Ciclo',
        description: 'Acompanhar seu ciclo financeiro',
        url: '/ciclo',
        icons: [{ src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  };
}
