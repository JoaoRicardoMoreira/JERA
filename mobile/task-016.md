# Task 016 - Tela de Rendas

## Objetivo

Implementar tela mobile de rendas.

## Contexto

Equivale a `/rendas` do web.

## Escopo

- [ ] Total de renda do periodo.
- [ ] Lista de rendas com data, descricao, categoria e valor.
- [ ] Criacao via bottom sheet.
- [ ] Exclusao com confirmacao.
- [ ] Empty/loading/error states.

## Arquivos ou modulos envolvidos

- `apps/mobile/app/(tabs)/incomes.tsx`
- `apps/mobile/src/features/transactions/**`

## Criterios de aceite

- Lista bate com web para mesmo periodo.
- Criar/excluir reflete no web apos refresh.

## Dependencias

- Task 015.

## Observacoes tecnicas

Lista substitui tabela.

