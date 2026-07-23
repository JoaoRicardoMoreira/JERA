# Task 019 - GoalsModule

## Objetivo

Implementar metas por categoria e periodo.

---

## Contexto

A spec define metas por categoria, consulta por mes e ano, e calculo de progresso por categoria.

---

## Dependencias

* Task 018

---

## Arquivos envolvidos

Criar

* `src/modules/goals/goals.module.ts`
* `src/modules/goals/goals.controller.ts`
* `src/modules/goals/goals.service.ts`
* `src/modules/goals/goals.repository.ts`
* `src/modules/goals/dto/upsert-goal.dto.ts`
* `src/modules/goals/dto/goal-response.dto.ts`
* `src/modules/goals/dto/goal-query.dto.ts`
* `src/modules/goals/entities/goal.entity.ts`
* `src/modules/goals/interfaces/goal-repository.interface.ts`
* `src/modules/goals/interfaces/goal-service.interface.ts`
* `src/modules/goals/mapper/goal.mapper.ts`
* `src/modules/goals/validators/goal.validator.ts`
* `src/modules/goals/tests/goals.service.spec.ts`

Modificar

* `src/app.module.ts`

---

## Escopo

* [ ] Criar estrutura completa do modulo.
* [ ] Criar DTOs de upsert e consulta.
* [ ] Criar endpoint para criar ou atualizar meta.
* [ ] Criar endpoint para consultar metas por mes e ano.
* [ ] Calcular progresso por categoria.
* [ ] Respeitar soft delete.
* [ ] Garantir isolamento por usuario.
* [ ] Documentar endpoints no Swagger.

---

## Fora do escopo

* Nao criar dashboard agregado.
* Nao criar categorias novas.
* Nao criar transacoes.

---

## Criterios de aceite

* Meta e criada ou atualizada por categoria e periodo.
* Consulta retorna metas do usuario autenticado.
* Progresso por categoria e calculado.
* Teste unitario do service passa.

---

## Arquitetura envolvida

* Service Layer
* Repository Pattern
* DTO Layer
* Domain validation

---

## Observacoes

Valores monetarios devem seguir a decisao da spec: usar decimal, nao float.

---

## Proxima Task

Task 020 - RecurrencesModule CRUD
