# Task 017 - Form de Gasto

## Objetivo

Criar bottom sheet de novo gasto.

## Contexto

Equivale ao `ExpenseModalComponent` e `ExpenseFormComponent` do web.

## Escopo

- [ ] Campos: descricao, valor, data, categoria.
- [ ] Filtrar categorias `EXPENSE`.
- [ ] Validar campos obrigatorios.
- [ ] Chamar criacao de gasto.
- [ ] Exibir loading/erro.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/features/transactions/components/ExpenseFormSheet.tsx`
- `apps/mobile/src/features/transactions/hooks/useCreateExpense.ts`

## Criterios de aceite

- Gasto criado aparece apos invalidacao.
- Payload bate com API.

## Dependencias

- Task 010.
- Task 013.

## Observacoes tecnicas

Categoria pode ser sem categoria se a API permitir, mas a UI deve priorizar selecao.

