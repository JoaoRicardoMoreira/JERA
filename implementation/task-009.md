# Task 009 - Shared e Common base

## Objetivo

Criar os elementos compartilhados basicos usados por todos os modulos.

---

## Contexto

A spec define `shared` para DTOs, types e enums genericos, e `common` para interfaces, constants e utils transversais.

---

## Dependencias

* Task 005

---

## Arquivos envolvidos

Criar

* `src/shared/dto/pagination-query.dto.ts`
* `src/shared/dto/date-range-query.dto.ts`
* `src/shared/types/nullable.type.ts`
* `src/shared/types/id.type.ts`
* `src/shared/enums/environment.enum.ts`
* `src/shared/enums/sort-direction.enum.ts`
* `src/common/interfaces/api-response.interface.ts`
* `src/common/interfaces/pagination.interface.ts`
* `src/common/interfaces/request-user.interface.ts`
* `src/common/constants/error-codes.ts`
* `src/common/constants/app.constants.ts`
* `src/common/utils/date.util.ts`
* `src/common/utils/crypto.util.ts`
* `src/common/utils/pagination.util.ts`
* `src/common/utils/currency.util.ts`

Modificar

* Nenhum.

---

## Escopo

* [ ] Criar DTOs compartilhados de paginacao e intervalo de datas.
* [ ] Criar tipos auxiliares.
* [ ] Criar enums genericos.
* [ ] Criar interfaces de resposta e request user.
* [ ] Criar constants de erros e aplicacao.
* [ ] Criar utils basicos previstos na spec.

---

## Fora do escopo

* Nao criar regras de negocio.
* Nao criar repositories.
* Nao criar controllers.

---

## Criterios de aceite

* Arquivos compartilhados existem.
* DTOs usam `class-validator` quando aplicavel.
* Build passa.
* Nenhuma dependencia circular foi criada.

---

## Arquitetura envolvida

* Shared Layer
* Common Layer
* DTO Layer
* Utils

---

## Observacoes

Evitar abstracoes sem uso imediato. Criar apenas o que a spec lista.

---

## Proxima Task

Task 010 - Exception filters
