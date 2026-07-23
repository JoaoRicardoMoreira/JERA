# Task 018 - Tela de Gastos

## Objetivo

Implementar tela mobile de gastos.

## Contexto

Equivale a `/gastos` do web.

## Escopo

- [ ] Total de gastos do periodo.
- [ ] Breakdown por categoria com barras.
- [ ] Lista de gastos com data, descricao, categoria e valor.
- [ ] Criacao via bottom sheet.
- [ ] Exclusao com confirmacao.
- [ ] Empty/loading/error states.

## Arquivos ou modulos envolvidos

- `apps/mobile/app/(tabs)/expenses.tsx`
- `apps/mobile/src/features/transactions/**`

## Criterios de aceite

- Total, lista e categorias batem com web.
- Criar/excluir reflete no web apos refresh.

## Dependencias

- Task 017.

## Observacoes tecnicas

Evitar tabela horizontal; usar lista legivel.

