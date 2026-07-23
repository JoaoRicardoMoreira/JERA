# Task 022 - DashboardModule

## Objetivo

Criar endpoints agregados para resumo mensal e dados de graficos.

---

## Contexto

A spec define que o BFF deve retornar payloads prontos para o front-end, como `GET /dashboard/monthly-summary` e `GET /dashboard/charts`.

---

## Dependencias

* Task 019
* Task 021

---

## Arquivos envolvidos

Criar

* `src/modules/dashboard/dashboard.module.ts`
* `src/modules/dashboard/dashboard.controller.ts`
* `src/modules/dashboard/dashboard.service.ts`
* `src/modules/dashboard/dashboard.repository.ts`
* `src/modules/dashboard/dto/dashboard-query.dto.ts`
* `src/modules/dashboard/dto/monthly-summary-response.dto.ts`
* `src/modules/dashboard/dto/charts-response.dto.ts`
* `src/modules/dashboard/entities/dashboard-summary.entity.ts`
* `src/modules/dashboard/interfaces/dashboard-repository.interface.ts`
* `src/modules/dashboard/interfaces/dashboard-service.interface.ts`
* `src/modules/dashboard/mapper/dashboard.mapper.ts`
* `src/modules/dashboard/validators/dashboard.validator.ts`
* `src/modules/dashboard/tests/dashboard.service.spec.ts`

Modificar

* `src/app.module.ts`

---

## Escopo

* [ ] Criar endpoint `GET /dashboard/monthly-summary`.
* [ ] Criar endpoint `GET /dashboard/charts`.
* [ ] Agregar receitas, despesas, saldo e metas.
* [ ] Agregar gastos por categoria.
* [ ] Retornar payload orientado ao front-end.
* [ ] Filtrar por usuario, mes e ano.
* [ ] Documentar endpoints no Swagger.

---

## Fora do escopo

* Nao criar novas transacoes.
* Nao processar recorrencias automaticamente.
* Nao importar CSV.

---

## Criterios de aceite

* Resumo mensal retorna totais corretos.
* Graficos retornam categorias, gastos e metas.
* Payload nao expoe detalhes internos do banco.
* Teste unitario do service passa.

---

## Arquitetura envolvida

* Backend for Frontend
* Service Layer
* Repository Pattern
* DTO Response

---

## Observacoes

Esta task deve reduzir chamadas do front-end, consolidando dados em respostas prontas.

---

## Proxima Task

Task 023 - ImportExportModule CSV
