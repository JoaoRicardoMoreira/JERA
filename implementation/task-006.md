# Task 006 - Docker e PostgreSQL

## Objetivo

Criar ambiente local com Docker, Docker Compose e PostgreSQL.

---

## Contexto

A spec exige Docker + Docker Compose, servicos `api` e `postgres`, volume nomeado e healthcheck com `pg_isready`.

---

## Dependencias

* Task 004

---

## Arquivos envolvidos

Criar

* `Dockerfile`
* `docker-compose.yml`
* `.dockerignore`

Modificar

* `.env.example`

---

## Escopo

* [ ] Criar Dockerfile multi-stage.
* [ ] Criar `docker-compose.yml` com `api` e `postgres`.
* [ ] Configurar volume `postgres_data`.
* [ ] Configurar healthcheck do PostgreSQL.
* [ ] Garantir uso de variaveis do `.env`.

---

## Fora do escopo

* Nao criar schema Prisma.
* Nao criar migrations.
* Nao implementar endpoints.

---

## Criterios de aceite

* PostgreSQL sobe via Docker Compose.
* Healthcheck do banco funciona.
* API possui definicao no Compose.
* `.dockerignore` evita copiar arquivos desnecessarios.

---

## Arquitetura envolvida

* Infraestrutura local
* Docker
* PostgreSQL
* Configuracao por ambiente

---

## Observacoes

O Dockerfile final sera endurecido novamente na task de hardening.

---

## Proxima Task

Task 007 - Prisma schema e migrations iniciais
