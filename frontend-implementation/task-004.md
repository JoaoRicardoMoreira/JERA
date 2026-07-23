# Task 004 - HTTP base e modelos de API

## Objetivo

Habilitar `HttpClient` no Angular e criar modelos comuns de resposta e erro do BFF.

---

## Contexto

Todas as respostas JSON do backend seguem envelope `success/data/meta`, e erros seguem formato padronizado.

---

## Dependencias

* Task 003

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/core/api/api-response.model.ts`
* `apps/web/src/app/core/api/api-error.model.ts`
* `apps/web/src/app/core/api/api-error.util.ts`

Modificar

* `apps/web/src/app/app.config.ts`

---

## Escopo

* [ ] Habilitar `provideHttpClient`.
* [ ] Criar `ApiResponse<T>`.
* [ ] Criar `ApiErrorResponse`.
* [ ] Criar `ApiErrorViewModel`.
* [ ] Criar normalizador de erro para `HttpErrorResponse`.

---

## Fora do escopo

* Nao criar interceptor JWT.
* Nao criar API services financeiros.
* Nao criar tela.

---

## Criterios de aceite

* App compila.
* Tipos comuns podem ser importados por qualquer feature.

---

## Arquitetura envolvida

* Core API layer.
* Tratamento padronizado de erros.

---

## Observacoes

Nao desembrulhar `data` em interceptor generico inicialmente; deixar explicito nos services para evitar surpresas com CSV/blob.

---

## Proxima Task

Task 005 - Modelos BFF e ViewModels financeiros

