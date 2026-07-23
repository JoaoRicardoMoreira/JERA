# Task 012 - Store de UI sem localStorage financeiro

## Objetivo

Refatorar `FinanceStore` para armazenar estado de tela/cache, removendo `localStorage` como fonte principal de dados financeiros.

---

## Contexto

O BFF passa a ser fonte de verdade. O frontend deve armazenar apenas filtros, loading, erros e dados em cache.

---

## Dependencias

* Task 010
* Task 011

---

## Arquivos envolvidos

Criar

* Nenhum obrigatorio.

Modificar

* `apps/web/src/app/state/finance.store.ts`
* `apps/web/src/app/models/finance-state.ts`
* `apps/web/src/app/services/finance.service.ts`

---

## Escopo

* [ ] Remover persistencia automatica de transacoes/metas/recorrencias em `localStorage`.
* [ ] Criar estado de UI com filtros, loading, erro e cache.
* [ ] Criar metodos para setar categorias, transacoes, dashboard, metas e recorrencias.
* [ ] Preservar Observables usados por componentes sempre que possivel.
* [ ] Manter compatibilidade temporaria com ViewModels atuais.

---

## Fora do escopo

* Nao integrar cada endpoint de tela ainda.
* Nao remover todos os modelos antigos se ainda forem usados.

---

## Criterios de aceite

* Refresh da pagina nao carrega dados financeiros antigos como fonte principal.
* App compila.
* Componentes atuais continuam recebendo Observables esperados.

---

## Arquitetura envolvida

* Client state.
* Cache de tela.
* Fonte de verdade no backend.

---

## Observacoes

Pode manter leitura de dados antigos apenas como estrategia futura de migracao, sem sobrescrever dados do BFF.

---

## Proxima Task

Task 013 - Categorias do BFF nos formularios

