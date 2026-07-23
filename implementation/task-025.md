# Task 025 - Testes de integracao

## Objetivo

Criar testes de integracao para repositories, PrismaService e fluxos com banco.

---

## Contexto

A spec exige testes de integracao com banco separado, preferencialmente via Docker.

---

## Dependencias

* Task 023
* Task 024

---

## Arquivos envolvidos

Criar

* `test/integration/`
* `test/integration/prisma.service.spec.ts`
* `test/integration/repositories/*.spec.ts`
* Helpers de banco de teste em `test/integration/helpers/`

Modificar

* `package.json`
* `docker-compose.yml`
* `.env.example`

---

## Escopo

* [ ] Configurar ambiente de teste com banco separado.
* [ ] Criar helpers para limpar dados entre testes.
* [ ] Testar PrismaService.
* [ ] Testar repositories principais com banco real.
* [ ] Testar isolamento por `userId`.
* [ ] Testar soft delete em repositories.

---

## Fora do escopo

* Nao criar testes HTTP E2E.
* Nao testar Swagger.
* Nao alterar schema sem necessidade.

---

## Criterios de aceite

* Testes de integracao executam contra banco de teste.
* Repositories principais passam.
* Isolamento por usuario e soft delete sao verificados.
* Testes unitarios continuam passando.

---

## Arquitetura envolvida

* Integration Testing
* Prisma
* PostgreSQL
* Repository Pattern

---

## Observacoes

O banco de teste deve ser separado do banco de desenvolvimento.

---

## Proxima Task

Task 026 - Testes E2E principais
