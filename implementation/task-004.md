# Task 004 - ConfigModule e variaveis de ambiente

## Objetivo

Configurar `ConfigModule` global e validacao das variaveis de ambiente.

---

## Contexto

A spec centraliza configuracoes em `src/config` e exige `.env.example`, ambientes `development`, `test` e `production`, alem de validacao de variaveis sensiveis.

---

## Dependencias

* Task 001
* Task 002

---

## Arquivos envolvidos

Criar

* `.env.example`
* `src/config/app.config.ts`
* `src/config/database.config.ts`
* `src/config/jwt.config.ts`
* `src/config/cors.config.ts`
* `src/config/swagger.config.ts`
* `src/config/validation.config.ts`
* `src/config/env.validation.ts`

Modificar

* `src/app.module.ts`
* `package.json`

---

## Escopo

* [ ] Instalar dependencias de configuracao necessarias.
* [ ] Registrar `ConfigModule` como global.
* [ ] Criar configuracoes agrupadas por dominio.
* [ ] Validar variaveis obrigatorias.
* [ ] Criar `.env.example` com as chaves da spec.

---

## Fora do escopo

* Nao configurar Prisma.
* Nao criar Docker.
* Nao implementar autenticacao.
* Nao criar Swagger UI ainda.

---

## Criterios de aceite

* Aplicacao falha ao iniciar se variavel obrigatoria estiver ausente.
* `.env.example` contem as variaveis da spec.
* `ConfigModule` esta disponivel globalmente.
* Build passa.

---

## Arquitetura envolvida

* ConfigModule
* Dependency Injection
* Configuracao por ambiente

---

## Observacoes

Secrets reais nao devem ser versionados. Apenas `.env.example` deve entrar no repositorio.

---

## Proxima Task

Task 005 - Bootstrap HTTP global
