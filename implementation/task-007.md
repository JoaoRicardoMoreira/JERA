# Task 007 - Prisma schema e migrations iniciais

## Objetivo

Criar o schema inicial do Prisma com os modelos persistidos definidos na spec.

---

## Contexto

A spec define Prisma como fonte oficial da modelagem persistida e lista os modelos `User`, `RefreshToken`, `Category`, `Transaction`, `Goal` e `Recurrence`.

---

## Dependencias

* Task 006

---

## Arquivos envolvidos

Criar

* `prisma/schema.prisma`
* `prisma/migrations/`

Modificar

* `package.json`

---

## Escopo

* [ ] Instalar Prisma e Prisma Client.
* [ ] Configurar datasource PostgreSQL com `DATABASE_URL`.
* [ ] Criar models previstos na spec.
* [ ] Usar UUID para IDs.
* [ ] Usar `Decimal` para valores monetarios.
* [ ] Adicionar `createdAt`, `updatedAt` e `deletedAt` onde previsto.
* [ ] Mapear nomes de tabelas e campos para snake_case quando necessario.
* [ ] Criar migration inicial.

---

## Fora do escopo

* Nao criar repositories.
* Nao criar seed.
* Nao implementar services.
* Nao criar endpoints.

---

## Criterios de aceite

* `prisma/schema.prisma` contem os modelos iniciais.
* Migration inicial e gerada.
* Prisma Client e geravel.
* Relacionamentos respeitam a spec.

---

## Arquitetura envolvida

* Prisma ORM
* Database Layer
* Soft delete
* Auditoria

---

## Observacoes

Todas as consultas funcionais futuras deverao filtrar por `userId`; esta task apenas prepara o modelo.

---

## Proxima Task

Task 008 - PrismaModule, PrismaService e seed
