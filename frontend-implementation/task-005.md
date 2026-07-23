# Task 005 - Modelos BFF e ViewModels financeiros

## Objetivo

Criar contratos TypeScript do BFF e ViewModels usados pela UI.

---

## Contexto

O backend usa contratos em ingles, valores monetarios como string decimal e UUIDs. A UI atual usa nomes em portugues, valores numericos e indices locais.

---

## Dependencias

* Task 004

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/finance/models/bff.models.ts`
* `apps/web/src/app/finance/models/finance-view.models.ts`

Modificar

* Nenhum obrigatorio.

---

## Escopo

* [ ] Criar tipos `TransactionType`, `RecurrenceFrequency`, `RecurrenceStatus`.
* [ ] Criar DTOs de auth, categorias, transacoes, dashboard, metas, recorrencias e CSV.
* [ ] Criar ViewModels de summary, charts, transaction, goal e recurrence.
* [ ] Criar tipo `FinanceUiState`.

---

## Fora do escopo

* Nao implementar mappers.
* Nao alterar componentes.
* Nao chamar backend.

---

## Criterios de aceite

* Tipos refletem `frontend-integration-spec.md`.
* App compila sem uso ainda dos tipos.

---

## Arquitetura envolvida

* DTO Layer frontend.
* ViewModel Layer.

---

## Observacoes

Manter `amount` como `string` nos DTOs do BFF e como `number` nos ViewModels.

---

## Proxima Task

Task 006 - TokenStorage e modelos de auth

