# Task 017 - CategoriesModule

## Objetivo

Criar categorias financeiras padrao e endpoint de listagem por usuario.

---

## Contexto

A spec define categorias financeiras como dominio inicial e exige que o usuario possua categorias padrao, com soft delete respeitado.

---

## Dependencias

* Task 016

---

## Arquivos envolvidos

Criar

* `src/modules/categories/categories.module.ts`
* `src/modules/categories/categories.controller.ts`
* `src/modules/categories/categories.service.ts`
* `src/modules/categories/categories.repository.ts`
* `src/modules/categories/dto/category-response.dto.ts`
* `src/modules/categories/entities/category.entity.ts`
* `src/modules/categories/interfaces/category-repository.interface.ts`
* `src/modules/categories/interfaces/category-service.interface.ts`
* `src/modules/categories/mapper/category.mapper.ts`
* `src/modules/categories/validators/category.validator.ts`
* `src/modules/categories/tests/categories.service.spec.ts`

Modificar

* `src/app.module.ts`
* `prisma/seed.ts`

---

## Escopo

* [ ] Criar estrutura completa do modulo.
* [ ] Criar repository filtrando por `userId` e `deletedAt`.
* [ ] Criar service de listagem de categorias do usuario.
* [ ] Garantir categorias padrao no seed.
* [ ] Criar controller com endpoint `/categories`.
* [ ] Documentar endpoint no Swagger.

---

## Fora do escopo

* Nao criar CRUD generico completo.
* Nao criar metas.
* Nao criar transacoes.

---

## Criterios de aceite

* Usuario autenticado lista suas categorias.
* Registros com `deletedAt` sao ignorados.
* Endpoint exige JWT.
* Teste unitario do service passa.

---

## Arquitetura envolvida

* Module Layer
* Repository Pattern
* Service Layer
* Controller Layer
* Soft delete

---

## Observacoes

Manter resposta orientada ao front-end, sem expor detalhes internos do banco.

---

## Proxima Task

Task 018 - TransactionsModule
