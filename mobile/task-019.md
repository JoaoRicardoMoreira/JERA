# Task 019 - Recorrentes API

## Objetivo

Implementar repositorio e hooks de recorrentes.

## Contexto

Recorrentes possuem endpoints proprios e processamento do periodo.

## Escopo

- [ ] `GET /recurrences`.
- [ ] `POST /recurrences`.
- [ ] `POST /recurrences/process`.
- [ ] `DELETE /recurrences/:id`.
- [ ] Mappers BFF -> view model.
- [ ] Query keys e invalidacao.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/features/recurrences/**`

## Criterios de aceite

- Hooks retornam dados tipados.
- Mutacoes invalidam dashboard e transacoes quando necessario.

## Dependencias

- Task 011.

## Observacoes tecnicas

Processamento deve usar o mes/ano ativo.

