# Task 015 - Form de Renda

## Objetivo

Criar bottom sheet de nova renda.

## Contexto

Equivale ao `RendaModalComponent` do web.

## Escopo

- [ ] Campos: descricao, valor, data, categoria opcional.
- [ ] Filtrar categorias `INCOME`.
- [ ] Validar campos obrigatorios.
- [ ] Chamar criacao de renda.
- [ ] Exibir loading/erro.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/features/transactions/components/IncomeFormSheet.tsx`
- `apps/mobile/src/features/transactions/hooks/useCreateIncome.ts`

## Criterios de aceite

- Renda criada aparece apos invalidacao.
- Payload bate com API.

## Dependencias

- Task 010.
- Task 013.

## Observacoes tecnicas

Valor deve ser enviado como string decimal.

