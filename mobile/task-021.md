# Task 021 - Investimentos API

## Objetivo

Implementar repositorio e hooks de investimentos.

## Contexto

O web tem painel de investimentos com endpoints dedicados.

## Escopo

- [ ] `GET /investments/overview`.
- [ ] `PUT /investments/config`.
- [ ] `PUT /investments/contributions`.
- [ ] `DELETE /investments/contributions/:id`.
- [ ] Query keys e invalidacoes.
- [ ] Helpers para formatar taxa e valores.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/features/investments/**`

## Criterios de aceite

- Overview carrega dados do BFF.
- Mutacoes atualizam overview.

## Dependencias

- Task 011.

## Observacoes tecnicas

Respeitar permissoes `investments:read` e `investments:manage`.

