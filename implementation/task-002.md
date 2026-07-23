# Task 002 - Estrutura de pastas base

## Objetivo

Criar a estrutura de diretorios definida na `spec.md`.

---

## Contexto

A spec define uma arquitetura modular com separacao entre `config`, `database`, `common`, `shared`, `modules` e `infra`. Esta task prepara o terreno sem adicionar regras de negocio.

---

## Dependencias

* Task 001

---

## Arquivos envolvidos

Criar

* `src/config/`
* `src/database/`
* `src/common/decorators/`
* `src/common/filters/`
* `src/common/guards/`
* `src/common/interceptors/`
* `src/common/middlewares/`
* `src/common/pipes/`
* `src/common/utils/`
* `src/common/constants/`
* `src/common/interfaces/`
* `src/shared/dto/`
* `src/shared/types/`
* `src/shared/enums/`
* `src/modules/`
* `src/infra/external-services/`
* `src/infra/http/`
* `src/infra/storage/`
* `src/infra/queue/`

Modificar

* Nenhum.

---

## Escopo

* [ ] Criar todos os diretorios base previstos na spec.
* [ ] Manter pastas vazias somente quando necessario para proximas tasks.
* [ ] Preservar nomes em kebab-case.

---

## Fora do escopo

* Nao criar services.
* Nao criar controllers.
* Nao criar DTOs.
* Nao configurar imports.

---

## Criterios de aceite

* Estrutura de pastas existe conforme a spec.
* Projeto continua compilando.
* Nenhuma funcionalidade foi adicionada.

---

## Arquitetura envolvida

* Organizacao por camadas
* Modularizacao NestJS
* Shared Layer
* Infra Layer

---

## Observacoes

Caso o Git nao versione pastas vazias, usar arquivos `.gitkeep` somente onde for necessario.

---

## Proxima Task

Task 003 - ESLint e Prettier
