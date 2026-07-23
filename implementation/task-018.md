# Task 018 - TransactionsModule

## Objetivo

Implementar receitas, despesas, historico por periodo e exclusao via soft delete.

---

## Contexto

A spec define endpoints orientados ao BFF: `POST /transactions/expense`, `POST /transactions/income` e `GET /transactions/history`.

---

## Dependencias

* Task 017

---

## Arquivos envolvidos

Criar

* `src/modules/transactions/transactions.module.ts`
* `src/modules/transactions/transactions.controller.ts`
* `src/modules/transactions/transactions.service.ts`
* `src/modules/transactions/transactions.repository.ts`
* `src/modules/transactions/dto/create-expense.dto.ts`
* `src/modules/transactions/dto/create-income.dto.ts`
* `src/modules/transactions/dto/transaction-response.dto.ts`
* `src/modules/transactions/dto/transaction-query.dto.ts`
* `src/modules/transactions/entities/transaction.entity.ts`
* `src/modules/transactions/entities/transaction-type.enum.ts`
* `src/modules/transactions/interfaces/transaction-repository.interface.ts`
* `src/modules/transactions/interfaces/transaction-service.interface.ts`
* `src/modules/transactions/mapper/transaction.mapper.ts`
* `src/modules/transactions/validators/transaction.validator.ts`
* `src/modules/transactions/tests/transactions.service.spec.ts`

Modificar

* `src/app.module.ts`

---

## Escopo

* [ ] Criar estrutura completa do modulo.
* [ ] Criar DTOs de receita, despesa e query.
* [ ] Validar valores monetarios como decimal positivo.
* [ ] Criar endpoint para receita.
* [ ] Criar endpoint para despesa.
* [ ] Criar endpoint de historico por mes, ano e tipo.
* [ ] Implementar soft delete.
* [ ] Garantir isolamento por `userId`.
* [ ] Documentar endpoints no Swagger.

---

## Fora do escopo

* Nao criar dashboard.
* Nao criar importacao CSV.
* Nao processar recorrencias.

---

## Criterios de aceite

* Receitas sao criadas.
* Despesas sao criadas.
* Historico filtra por periodo e tipo.
* Exclusao preenche `deletedAt`.
* Dados de outro usuario nao aparecem.

---

## Arquitetura envolvida

* BFF endpoints
* Repository Pattern
* DTO Validation
* Soft delete
* User isolation

---

## Observacoes

Evitar endpoints CRUD genericos; os nomes devem refletir os fluxos do front-end.

---

## Proxima Task

Task 019 - GoalsModule
