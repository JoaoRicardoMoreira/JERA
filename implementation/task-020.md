# Task 020 - RecurrencesModule CRUD

## Objetivo

Implementar criacao, listagem e exclusao de recorrencias.

---

## Contexto

A spec define transacoes recorrentes como dominio proprio, com endpoints protegidos e soft delete.

---

## Dependencias

* Task 018

---

## Arquivos envolvidos

Criar

* `src/modules/recurrences/recurrences.module.ts`
* `src/modules/recurrences/recurrences.controller.ts`
* `src/modules/recurrences/recurrences.service.ts`
* `src/modules/recurrences/recurrences.repository.ts`
* `src/modules/recurrences/dto/create-recurrence.dto.ts`
* `src/modules/recurrences/dto/recurrence-response.dto.ts`
* `src/modules/recurrences/entities/recurrence.entity.ts`
* `src/modules/recurrences/entities/recurrence-status.enum.ts`
* `src/modules/recurrences/interfaces/recurrence-repository.interface.ts`
* `src/modules/recurrences/interfaces/recurrence-service.interface.ts`
* `src/modules/recurrences/mapper/recurrence.mapper.ts`
* `src/modules/recurrences/validators/recurrence.validator.ts`
* `src/modules/recurrences/tests/recurrences.service.spec.ts`

Modificar

* `src/app.module.ts`

---

## Escopo

* [ ] Criar estrutura completa do modulo.
* [ ] Criar DTO de criacao.
* [ ] Validar dia, tipo, valor e categoria quando aplicavel.
* [ ] Criar endpoint `POST /recurrences`.
* [ ] Criar endpoint de listagem de recorrencias ativas.
* [ ] Criar endpoint de exclusao por soft delete.
* [ ] Garantir isolamento por usuario.
* [ ] Documentar endpoints no Swagger.

---

## Fora do escopo

* Nao processar recorrencias automaticamente.
* Nao criar dashboard.
* Nao criar import/export.

---

## Criterios de aceite

* Recorrencia e criada.
* Recorrencias ativas sao listadas.
* Exclusao usa `deletedAt`.
* Teste unitario do service passa.

---

## Arquitetura envolvida

* Module Layer
* DTO Validation
* Repository Pattern
* Soft delete

---

## Observacoes

A regra de nao duplicar recorrencia por mes sera implementada na proxima task.

---

## Proxima Task

Task 021 - Processamento de recorrencias
