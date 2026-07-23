# Task 017 - Recorrencias via BFF

## Objetivo

Integrar criacao, listagem, exclusao e processamento de recorrencias pelo BFF.

---

## Contexto

O frontend atual cria transacoes recorrentes localmente ao carregar. Essa responsabilidade agora e do backend.

---

## Dependencias

* Task 010
* Task 011
* Task 012
* Task 013
* Task 014

---

## Arquivos envolvidos

Criar

* Nenhum obrigatorio.

Modificar

* `apps/web/src/app/services/finance.service.ts`
* `apps/web/src/app/state/finance.store.ts`
* `apps/web/src/app/components/modals/recurrence-modal.component.ts`
* `apps/web/src/app/components/modals/recurrence-modal.component.html`

---

## Escopo

* [ ] Criar recorrencia via `POST /recurrences`.
* [ ] Listar recorrencias via `GET /recurrences`.
* [ ] Excluir recorrencia por `id`.
* [ ] Processar recorrencias via `POST /recurrences/process`.
* [ ] Remover processamento local automatico.
* [ ] Recarregar historico/dashboard apos processamento.

---

## Fora do escopo

* Nao criar frequencias nao suportadas.
* Nao criar edicao de recorrencia.

---

## Criterios de aceite

* Recorrencia persiste no backend.
* Processamento nao duplica transacoes no mesmo periodo.
* UI nao cria transacao recorrente localmente.

---

## Arquitetura envolvida

* Recurrences API.
* Backend-owned scheduling logic.

---

## Observacoes

Campo `dia` atual deve ser convertido para `startDate`.

---

## Proxima Task

Task 018 - CSV via BFF

