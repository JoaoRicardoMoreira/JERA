# Task 010 - API services financeiros

## Objetivo

Criar services Angular para consumir os modulos financeiros do BFF.

---

## Contexto

Cada dominio financeiro deve ter um service focado, deixando `FinanceService` como fachada de orquestracao.

---

## Dependencias

* Task 005
* Task 008

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/finance/services/categories-api.service.ts`
* `apps/web/src/app/finance/services/transactions-api.service.ts`
* `apps/web/src/app/finance/services/dashboard-api.service.ts`
* `apps/web/src/app/finance/services/goals-api.service.ts`
* `apps/web/src/app/finance/services/recurrences-api.service.ts`
* `apps/web/src/app/finance/services/import-export-api.service.ts`

Modificar

* Nenhum obrigatorio.

---

## Escopo

* [ ] Implementar `GET /categories`.
* [ ] Implementar endpoints de transacoes.
* [ ] Implementar endpoints de dashboard.
* [ ] Implementar endpoints de goals.
* [ ] Implementar endpoints de recurrences.
* [ ] Implementar CSV export com `responseType: 'blob'`.
* [ ] Implementar CSV import com `FormData`.

---

## Fora do escopo

* Nao alterar componentes.
* Nao alterar store.
* Nao implementar mappers.

---

## Criterios de aceite

* Services retornam Observables com `data` desembrulhado.
* CSV export retorna `Blob`.
* CSV import retorna `ImportCsvResponse`.

---

## Arquitetura envolvida

* API service layer.
* BFF contracts.

---

## Observacoes

Evitar duplicar montagem de URL; usar `environment.apiBaseUrl`.

---

## Proxima Task

Task 011 - Mappers financeiros

