# Task 011 - Query e Cache

## Objetivo

Configurar React Query para carregamento, cache e invalidacao.

## Contexto

Dashboard, listas e investimentos precisam de refresh e invalidacao apos mutacoes.

## Escopo

- [ ] Criar `QueryClient`.
- [ ] Criar query keys por modulo.
- [ ] Configurar provider no layout raiz.
- [ ] Definir padrao de stale time e retry.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/state/query-client.ts`
- `apps/mobile/app/_layout.tsx`
- `apps/mobile/src/lib/query/keys.ts`

## Criterios de aceite

- Queries podem ser usadas por features.
- Retry nao gera loop em `401`.

## Dependencias

- Task 005.
- Task 008.

## Observacoes tecnicas

Refresh auth fica no cliente API, nao em cada query.

