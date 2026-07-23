# Task 008 - Protecao de Rotas

## Objetivo

Criar layout autenticado e redirecionamentos por sessao.

## Contexto

O web usa `authGuard`; o mobile deve ter gate equivalente.

## Escopo

- [ ] Criar layout raiz.
- [ ] Criar grupo `(auth)`.
- [ ] Criar grupo `(tabs)`.
- [ ] Restaurar sessao ao abrir app.
- [ ] Redirecionar sem sessao para login.

## Arquivos ou modulos envolvidos

- `apps/mobile/app/_layout.tsx`
- `apps/mobile/app/(auth)/**`
- `apps/mobile/app/(tabs)/**`
- `apps/mobile/src/features/auth/AuthGate.tsx`

## Criterios de aceite

- Usuario sem sessao nao acessa tabs.
- Usuario com sessao entra no app.

## Dependencias

- Task 007.

## Observacoes tecnicas

Mostrar loading discreto durante restore.

