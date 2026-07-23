# Task 011 - Mappers financeiros

## Objetivo

Criar mappers entre DTOs do BFF, ViewModels e inputs atuais da UI.

---

## Contexto

Os componentes atuais trabalham com `desc`, `valor`, `data`, `categoria`, enquanto o BFF trabalha com `description`, `amount`, `occurredAt`, `categoryId`.

---

## Dependencias

* Task 005

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/finance/mappers/transaction.mapper.ts`
* `apps/web/src/app/finance/mappers/dashboard.mapper.ts`
* `apps/web/src/app/finance/mappers/goal.mapper.ts`
* `apps/web/src/app/finance/mappers/recurrence.mapper.ts`
* `apps/web/src/app/finance/mappers/month.mapper.ts`

Modificar

* Nenhum obrigatorio.

---

## Escopo

* [ ] Mapear `TransactionResponse` para `TransactionViewModel`.
* [ ] Mapear inputs de receita/despesa para requests do BFF.
* [ ] Mapear dashboard para summary/charts ViewModels.
* [ ] Mapear goals para ViewModels e `MetaMap` temporario.
* [ ] Mapear recurrence atual para request do BFF.
* [ ] Centralizar conversao de mes UI/API.

---

## Fora do escopo

* Nao chamar backend.
* Nao alterar componentes.

---

## Criterios de aceite

* Mappers possuem testes ou sao simples e tipados.
* Conversoes monetarias usam duas casas decimais.
* Mes enviado ao BFF fica entre 1 e 12.

---

## Arquitetura envolvida

* Adapter pattern.
* ViewModel mapping.

---

## Observacoes

Nunca usar nome de categoria como identificador permanente quando houver `categoryId`.

---

## Proxima Task

Task 012 - Store de UI sem localStorage financeiro

