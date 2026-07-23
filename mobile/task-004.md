# Task 004 - Contratos BFF

## Objetivo

Criar os tipos TypeScript mobile equivalentes aos contratos usados pelo web.

## Contexto

O mobile deve chamar os mesmos endpoints e preservar campos, validacoes e permissoes.

## Escopo

- [ ] Criar `types/bff.models.ts`.
- [ ] Copiar contratos de auth, categorias, dashboard, transacoes, recorrentes, metas e investimentos.
- [ ] Criar tipos de view model mobile quando necessario.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/types/bff.models.ts`
- `apps/mobile/src/features/*/types.ts`

## Criterios de aceite

- Tipos cobrem todos os endpoints obrigatorios.
- Campos batem com `apps/web/src/app/finance/models/bff.models.ts`.

## Dependencias

- Task 002.

## Observacoes tecnicas

Evitar divergencia de nomes sem necessidade.

