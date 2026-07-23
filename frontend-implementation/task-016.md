# Task 016 - Metas via BFF

## Objetivo

Integrar metas mensais por categoria com `GET /goals` e `PUT /goals`.

---

## Contexto

Metas atuais sao um `Record<categoryName, number>`. O BFF trabalha por `categoryId`, mes e ano.

---

## Dependencias

* Task 010
* Task 011
* Task 012
* Task 013
* Task 015

---

## Arquivos envolvidos

Criar

* Nenhum obrigatorio.

Modificar

* `apps/web/src/app/services/finance.service.ts`
* `apps/web/src/app/state/finance.store.ts`
* `apps/web/src/app/components/metas/metas.component.ts`
* `apps/web/src/app/components/metas/metas.component.html`
* `apps/web/src/app/components/modals/meta-modal.component.ts`
* `apps/web/src/app/components/modals/meta-modal.component.html`

---

## Escopo

* [ ] Listar metas por mes/ano.
* [ ] Criar/atualizar meta por `categoryId`.
* [ ] Atualizar UI de metas para usar IDs.
* [ ] Recarregar dashboard e graficos apos alterar meta.
* [ ] Exibir progresso vindo do BFF.

---

## Fora do escopo

* Nao criar delete de meta.
* Nao alterar backend.

---

## Criterios de aceite

* Meta persiste apos refresh da pagina.
* Progresso acompanha despesas persistidas.
* UI nao usa nome da categoria como chave de gravacao.

---

## Arquitetura envolvida

* Goals API.
* Category relationship.
* ViewModel mapping.

---

## Observacoes

Pode manter `MetaMap` apenas como adapter temporario para componentes legados.

---

## Proxima Task

Task 017 - Recorrencias via BFF

