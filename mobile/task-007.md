# Task 007 - Auth Service

## Objetivo

Implementar registro, login, refresh, logout e usuario atual.

## Contexto

Autenticacao mobile deve ser compativel com `AuthService` do web e com a API atual.

## Escopo

- [ ] `POST /auth/login`.
- [ ] `POST /auth/register`.
- [ ] `POST /auth/refresh`.
- [ ] `POST /auth/logout`.
- [ ] `GET /users/me`.
- [ ] Atualizar storage apos login/register/refresh.
- [ ] Limpar storage no logout.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/features/auth/auth.api.ts`
- `apps/mobile/src/features/auth/auth.service.ts`
- `apps/mobile/src/features/auth/auth.store.ts`

## Criterios de aceite

- Login salva sessao.
- Refresh rotaciona tokens.
- Logout revoga e limpa sessao.

## Dependencias

- Task 005.
- Task 006.

## Observacoes tecnicas

Em falha de logout, limpar sessao local mesmo assim.

