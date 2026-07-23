# Task 010 - Exception filters

## Objetivo

Padronizar respostas de erro HTTP, Prisma e inesperadas.

---

## Contexto

A spec define filtros globais e um padrao de erro contendo `success`, `statusCode`, `error`, `message`, `code`, `details`, `path` e `timestamp`.

---

## Dependencias

* Task 008
* Task 009

---

## Arquivos envolvidos

Criar

* `src/common/filters/http-exception.filter.ts`
* `src/common/filters/prisma-exception.filter.ts`
* `src/common/filters/unexpected-exception.filter.ts`

Modificar

* `src/main.ts`

---

## Escopo

* [ ] Criar filtro para exceptions HTTP conhecidas.
* [ ] Criar filtro para erros Prisma.
* [ ] Criar filtro para erros inesperados.
* [ ] Garantir formato de erro padrao.
* [ ] Registrar filters globalmente.

---

## Fora do escopo

* Nao criar interceptors.
* Nao implementar logs detalhados de request.
* Nao criar modulos de negocio.

---

## Criterios de aceite

* Erros HTTP seguem formato da spec.
* Erros Prisma nao vazam detalhes crus.
* Erros inesperados retornam status 500 padronizado.
* Build passa.

---

## Arquitetura envolvida

* Exception Filters
* Error Response Pattern
* Prisma
* Common Layer

---

## Observacoes

Nao expor stack trace em producao.

---

## Proxima Task

Task 011 - Interceptors e request context
