# Dashboard Redesign Spec

## Objetivo

Reestruturar a tela principal do FinanceControl para seguir o novo prototipo visual.

O dashboard deixa de ser uma tela operacional com formularios e tabelas detalhadas e passa a ser uma visao executiva mensal: saldo disponivel, totais de rendas/gastos e proximos recorrentes.

Rendas e gastos detalhados passam para telas dedicadas.

## Arquitetura de Navegacao

Rotas esperadas:

- `/dashboard`: visao geral do mes
- `/rendas`: lista e criacao de rendas
- `/gastos`: lista e criacao de gastos
- `/recorrentes`: gestao de recorrentes
- `/login`: autenticacao

`/` deve redirecionar para `/dashboard`.

## Shell

O shell autenticado deve conter:

- sidebar fixa
- area principal com header minimalista
- `router-outlet` para as paginas internas

## Dashboard

Deve exibir:

- label `VISAO GERAL · MES ANO`
- acoes rapidas `+ Nova Renda` e `+ Novo Gasto`
- saldo disponivel em formato hero
- card de renda mensal
- card de gastos totais
- lista de proximos recorrentes

Nao deve exibir:

- formulario de gasto
- tabela detalhada de gastos/rendas
- graficos completos
- metas completas
- investimentos completos

## Rendas

Tela dedicada para:

- total de renda do periodo
- lista detalhada de rendas
- acao de nova renda
- exclusao

## Gastos

Tela dedicada para:

- total de gastos do periodo
- lista detalhada de gastos
- formulario/acao de novo gasto
- exclusao

## Recorrentes

Tela dedicada para:

- recorrentes ativos
- criacao
- exclusao
- processamento do periodo

## Criterios

- Navegacao por rotas reais.
- Dashboard limpo e fiel ao prototipo.
- Fluxos existentes de criar/excluir renda, gasto e recorrente preservados.
- TypeScript do Angular deve compilar.
