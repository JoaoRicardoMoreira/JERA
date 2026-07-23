# Task 008 - PrismaModule, PrismaService e seed

## Objetivo

Integrar Prisma ao NestJS e criar seed local.

---

## Contexto

A spec define `database/prisma.module.ts`, `prisma.service.ts`, `prisma.middleware.ts` e seed com dados minimos de desenvolvimento.

---

## Dependencias

* Task 007

---

## Arquivos envolvidos

Criar

* `src/database/prisma.module.ts`
* `src/database/prisma.service.ts`
* `src/database/prisma.middleware.ts`
* `prisma/seed.ts`

Modificar

* `src/app.module.ts`
* `package.json`

---

## Escopo

* [ ] Criar `PrismaModule`.
* [ ] Criar `PrismaService` com lifecycle hooks.
* [ ] Preparar middleware Prisma para regras transversais futuras.
* [ ] Criar seed local para categorias padrao e dados minimos previstos.
* [ ] Registrar `PrismaModule` no `AppModule`.
* [ ] Adicionar script de seed.

---

## Fora do escopo

* Nao criar repositories de negocio.
* Nao implementar auth.
* Nao criar endpoints.

---

## Criterios de aceite

* Aplicacao conecta ao PostgreSQL.
* PrismaService e injetavel.
* Seed local e executavel.
* Build passa.

---

## Arquitetura envolvida

* Database Layer
* Dependency Injection
* Prisma ORM
* Seeds

---

## Observacoes

Seeds nao devem rodar automaticamente em producao.

---

## Proxima Task

Task 009 - Shared e Common base
