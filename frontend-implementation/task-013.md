# Task 013 - Categorias do BFF nos formularios

## Objetivo

Carregar categorias do BFF e adaptar formularios para usar `categoryId`.

---

## Contexto

O frontend atual usa uma lista fixa de nomes de categorias. O backend exige relacionamento por UUID.

---

## Dependencias

* Task 010
* Task 011
* Task 012

---

## Arquivos envolvidos

Criar

* Nenhum obrigatorio.

Modificar

* `apps/web/src/app/services/finance.service.ts`
* `apps/web/src/app/components/expense-form/expense-form.component.ts`
* `apps/web/src/app/components/expense-form/expense-form.component.html`
* `apps/web/src/app/components/modals/renda-modal.component.ts`
* `apps/web/src/app/components/modals/renda-modal.component.html`
* `apps/web/src/app/components/modals/meta-modal.component.ts`
* `apps/web/src/app/components/modals/meta-modal.component.html`
* `apps/web/src/app/components/modals/recurrence-modal.component.ts`
* `apps/web/src/app/components/modals/recurrence-modal.component.html`

---

## Escopo

* [ ] Carregar categorias apos autenticacao.
* [ ] Separar categorias `INCOME` e `EXPENSE`.
* [ ] Exibir nomes no select.
* [ ] Emitir `categoryId` nos formularios.
* [ ] Manter nome de categoria apenas como exibicao.

---

## Fora do escopo

* Nao criar CRUD de categorias.
* Nao alterar backend.
* Nao concluir transacoes.

---

## Criterios de aceite

* Formularios usam categorias da API.
* Despesas nao permitem categoria de receita.
* Receitas nao permitem categoria de despesa.

---

## Arquitetura envolvida

* Category API integration.
* UI form adaptation.

---

## Observacoes

Se o seed atual nao criar categorias para usuarios novos, registrar essa lacuna como dependencia de backend ou criar fluxo temporario validado.

---

## Proxima Task

Task 014 - Transacoes via BFF

