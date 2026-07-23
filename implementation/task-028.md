# Task 028 - Hardening de producao

## Objetivo

Reforcar seguranca, logs, rate limit e configuracao final de producao.

---

## Contexto

A spec define Helmet, rate limit, CORS restrito, logs sem dados sensiveis, Dockerfile otimizado e secrets fora do repositorio.

---

## Dependencias

* Task 026
* Task 027

---

## Arquivos envolvidos

Criar

* Nenhum obrigatorio.

Modificar

* `src/main.ts`
* `src/config/app.config.ts`
* `src/config/cors.config.ts`
* `src/common/interceptors/logging.interceptor.ts`
* `Dockerfile`
* `docker-compose.yml`
* `.env.example`
* `package.json`

---

## Escopo

* [ ] Habilitar Helmet.
* [ ] Configurar rate limit global.
* [ ] Aplicar regras mais restritivas para endpoints sensiveis quando previsto.
* [ ] Garantir CORS sem wildcard em producao.
* [ ] Revisar logs para nao expor dados sensiveis.
* [ ] Otimizar Dockerfile multi-stage.
* [ ] Garantir uso de usuario nao-root quando possivel.
* [ ] Confirmar que secrets reais nao sao versionados.
* [ ] Rodar lint, build, unit, integration e E2E.

---

## Fora do escopo

* Nao criar novas funcionalidades.
* Nao criar novas roles.
* Nao alterar contratos do front-end.

---

## Criterios de aceite

* Helmet esta habilitado.
* Rate limit esta configurado.
* Logs nao contem senhas, tokens ou dados financeiros completos.
* Dockerfile esta otimizado para runtime.
* Todas as suites de teste passam.

---

## Arquitetura envolvida

* Seguranca
* Logging
* Docker
* Configuracao por ambiente
* Hardening

---

## Observacoes

Esta task fecha a primeira versao pronta para evolucao incremental.

---

## Proxima Task

Nenhuma. Roadmap inicial concluido.
