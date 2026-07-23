# Task 005 - Bootstrap HTTP global

## Objetivo

Configurar comportamento HTTP global: prefixo `/api/v1`, CORS inicial e `ValidationPipe` global.

---

## Contexto

A spec define prefixo global, CORS restrito por ambiente e validacao global com `whitelist`, `forbidNonWhitelisted` e `transform`.

---

## Dependencias

* Task 004

---

## Arquivos envolvidos

Criar

* Nenhum.

Modificar

* `src/main.ts`
* `src/config/cors.config.ts`
* `src/config/validation.config.ts`

---

## Escopo

* [ ] Ler `API_PREFIX` da configuracao.
* [ ] Aplicar prefixo global `/api/v1`.
* [ ] Configurar CORS com origens vindas de `CORS_ORIGINS`.
* [ ] Configurar `ValidationPipe` global.
* [ ] Garantir `transformOptions.enableImplicitConversion: false`.

---

## Fora do escopo

* Nao criar DTOs de negocio.
* Nao criar filters.
* Nao criar interceptors.
* Nao configurar Swagger.

---

## Criterios de aceite

* API sobe usando prefixo global.
* CORS usa configuracao de ambiente.
* ValidationPipe global esta ativo.
* Build passa.

---

## Arquitetura envolvida

* Pipes
* ConfigModule
* Bootstrap HTTP
* Validacao global

---

## Observacoes

Nao usar wildcard de CORS em producao. A lista deve vir da configuracao.

---

## Proxima Task

Task 006 - Docker e PostgreSQL
