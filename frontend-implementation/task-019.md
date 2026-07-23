# Task 019 - Erros, loading e permissoes

## Objetivo

Padronizar estados de erro/loading e uso de permissoes no frontend integrado.

---

## Contexto

O BFF retorna erros padronizados e permissions no usuario/token. A UI deve reagir de forma consistente.

---

## Dependencias

* Task 008
* Task 012
* Task 014
* Task 015
* Task 016
* Task 017
* Task 018

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/core/auth/permission.service.ts`

Modificar

* `apps/web/src/app/state/finance.store.ts`
* `apps/web/src/app/services/finance.service.ts`
* `apps/web/src/app/app.component.html`
* Componentes que exibem erros/loading.

---

## Escopo

* [ ] Centralizar loading inicial, loading de mutacao e loading de dashboard.
* [ ] Centralizar erro normalizado.
* [ ] Criar helper `hasPermission`.
* [ ] Ocultar acoes sem permissao quando aplicavel.
* [ ] Tratar `401`, `403`, `422`, `429` com mensagens amigaveis.
* [ ] Evitar duplo submit em formularios.

---

## Fora do escopo

* Nao redesenhar layout completo.
* Nao criar sistema global de toast complexo se nao existir.

---

## Criterios de aceite

* Erros nao quebram a aplicacao.
* Usuario recebe feedback de falhas comuns.
* Botoes de mutacao respeitam loading.

---

## Arquitetura envolvida

* UX state.
* Error handling.
* Permissions.

---

## Observacoes

Permissoes no frontend sao UX, nao seguranca final.

---

## Proxima Task

Task 020 - Testes unitarios do frontend

