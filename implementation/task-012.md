# Task 012 - Swagger base

## Objetivo

Configurar Swagger/OpenAPI em `/docs` quando habilitado.

---

## Contexto

A spec exige Swagger com Bearer Auth, tags por modulo, DTOs, codigos HTTP e exemplos.

---

## Dependencias

* Task 011

---

## Arquivos envolvidos

Criar

* Nenhum.

Modificar

* `src/main.ts`
* `src/config/swagger.config.ts`
* `package.json`

---

## Escopo

* [ ] Instalar dependencias Swagger para NestJS.
* [ ] Ler `SWAGGER_ENABLED` e `SWAGGER_PATH`.
* [ ] Configurar documento OpenAPI.
* [ ] Configurar Bearer Auth.
* [ ] Expor `/docs` quando habilitado.

---

## Fora do escopo

* Nao documentar endpoints de negocio ainda.
* Nao criar DTOs de negocio.
* Nao criar auth.

---

## Criterios de aceite

* Swagger abre em `/docs` quando habilitado.
* Bearer Auth aparece no documento.
* Build passa.

---

## Arquitetura envolvida

* Swagger/OpenAPI
* ConfigModule
* Documentacao

---

## Observacoes

Em producao, Swagger deve ser opcional ou protegido conforme configuracao.

---

## Proxima Task

Task 013 - UsersModule base
