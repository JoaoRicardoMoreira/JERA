# Task 011 - Interceptors e request context

## Objetivo

Criar interceptors e middleware para padronizar respostas e logs de request.

---

## Contexto

A spec define `response.interceptor.ts`, `logging.interceptor.ts`, `serialization.interceptor.ts` e `request-context.middleware.ts`.

---

## Dependencias

* Task 010

---

## Arquivos envolvidos

Criar

* `src/common/interceptors/response.interceptor.ts`
* `src/common/interceptors/logging.interceptor.ts`
* `src/common/interceptors/serialization.interceptor.ts`
* `src/common/middlewares/request-context.middleware.ts`

Modificar

* `src/main.ts`
* `src/app.module.ts`

---

## Escopo

* [ ] Criar middleware de request context.
* [ ] Gerar ou propagar request ID.
* [ ] Criar interceptor de resposta com wrapper padrao.
* [ ] Criar interceptor de logging de request.
* [ ] Criar interceptor de serializacao.
* [ ] Registrar interceptors globais.

---

## Fora do escopo

* Nao implementar autenticacao.
* Nao criar endpoints.
* Nao trocar Logger do NestJS por biblioteca externa.

---

## Criterios de aceite

* Respostas de sucesso seguem wrapper padrao.
* Logs de request incluem metodo, path, status e tempo.
* Request ID esta disponivel no fluxo.
* Build passa.

---

## Arquitetura envolvida

* Interceptors
* Middlewares
* Logging
* Response Pattern

---

## Observacoes

Nao logar senhas, tokens, refresh tokens ou dados financeiros completos.

---

## Proxima Task

Task 012 - Swagger base
