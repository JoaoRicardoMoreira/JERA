# Task 020 - Tela de Recorrentes

## Objetivo

Implementar gerenciamento mobile de recorrentes.

## Contexto

Equivale a `/recorrentes` do web.

## Escopo

- [ ] Lista de recorrentes ativos.
- [ ] Bottom sheet de novo recorrente.
- [ ] Campos: tipo, descricao, valor, dia, categoria.
- [ ] Exclusao com confirmacao.
- [ ] Acao de processar periodo.
- [ ] Feedback do resultado processado.

## Arquivos ou modulos envolvidos

- `apps/mobile/app/(tabs)/recurrences.tsx`
- `apps/mobile/src/features/recurrences/**`

## Criterios de aceite

- Criar, excluir e processar funcionam contra API.
- Dados batem com web.

## Dependencias

- Task 010.
- Task 019.

## Observacoes tecnicas

Recorrencia mensal deve mapear `frequency: MONTHLY`.

