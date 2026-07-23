# Task 013 - Finance Repository

## Objetivo

Implementar acesso mobile a categorias, dashboard e transacoes.

## Contexto

Dashboard, rendas e gastos compartilham as mesmas chamadas da API.

## Escopo

- [ ] Categorias: `GET /categories`.
- [ ] Summary: `GET /dashboard/monthly-summary`.
- [ ] Charts: `GET /dashboard/charts`.
- [ ] Historico: `GET /transactions/history`.
- [ ] Criar renda/gasto.
- [ ] Excluir transacao.
- [ ] Mappers para view models.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/features/categories/**`
- `apps/mobile/src/features/dashboard/**`
- `apps/mobile/src/features/transactions/**`

## Criterios de aceite

- Repositorios retornam dados tipados.
- Mappers preservam campos do web.

## Dependencias

- Task 011.

## Observacoes tecnicas

Usar `limit` mobile definido e paginacao quando necessario.

