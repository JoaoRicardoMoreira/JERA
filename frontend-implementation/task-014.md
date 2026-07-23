# Task 014 - Transacoes via BFF

## Objetivo

Integrar criacao, listagem e exclusao de receitas/despesas ao BFF.

---

## Contexto

O frontend atual adiciona e remove itens localmente por indice. O BFF persiste transacoes por usuario e exclui por UUID.

---

## Dependencias

* Task 010
* Task 011
* Task 012
* Task 013

---

## Arquivos envolvidos

Criar

* Nenhum obrigatorio.

Modificar

* `apps/web/src/app/services/finance.service.ts`
* `apps/web/src/app/state/finance.store.ts`
* `apps/web/src/app/app.component.ts`
* `apps/web/src/app/components/history-tabs/history-tabs.component.ts`
* `apps/web/src/app/components/history-tabs/history-tabs.component.html`

---

## Escopo

* [ ] Criar receita via `POST /transactions/income`.
* [ ] Criar despesa via `POST /transactions/expense`.
* [ ] Listar receitas/despesas via `GET /transactions/history`.
* [ ] Excluir transacao via `DELETE /transactions/:id`.
* [ ] Trocar delete por indice para delete por `id`.
* [ ] Recarregar dados do periodo apos mutacoes.

---

## Fora do escopo

* Nao integrar dashboard.
* Nao integrar metas.
* Nao criar edicao de transacao.

---

## Criterios de aceite

* Receita criada aparece apos recarregar a pagina.
* Despesa criada aparece apos recarregar a pagina.
* Delete remove apenas item do usuario atual.
* App nao depende de `localStorage` para historico.

---

## Arquitetura envolvida

* Transactions API.
* Store facade.
* UUID-based operations.

---

## Observacoes

Como o endpoint de historico exige mes, tratar `month='all'` explicitamente.

---

## Proxima Task

Task 015 - Dashboard e graficos via BFF

