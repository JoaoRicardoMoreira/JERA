# Task 024 - Testes unitarios

## Objetivo

Consolidar testes unitarios para services, validators, mappers, utils e guards.

---

## Contexto

A spec exige Jest e testes unitarios cobrindo services, validators, mappers, utils e guards, com repositories mockados.

---

## Dependencias

* Task 016
* Task 023

---

## Arquivos envolvidos

Criar

* Testes ausentes em `src/modules/**/tests/*.spec.ts`
* Testes ausentes em `src/common/guards/tests/*.spec.ts`
* Testes ausentes para utils em `src/common/utils/*.spec.ts`

Modificar

* `package.json`
* Configuracao Jest existente, se necessario.

---

## Escopo

* [ ] Garantir testes dos services principais.
* [ ] Garantir testes de validators.
* [ ] Garantir testes de mappers.
* [ ] Garantir testes de utils.
* [ ] Garantir testes de guards.
* [ ] Mockar repositories em testes de service.
* [ ] Rodar suite unitaria.

---

## Fora do escopo

* Nao criar testes E2E.
* Nao usar banco real.
* Nao alterar regras de negocio.

---

## Criterios de aceite

* `npm test` passa.
* Services sao testados com repositories mockados.
* Guards possuem cobertura basica.
* Validators e mappers criticos possuem testes.

---

## Arquitetura envolvida

* Jest
* Unit Testing
* Service Layer
* Guards
* Mappers

---

## Observacoes

Se algum teste exigir muita infraestrutura, mover para integracao na proxima task.

---

## Proxima Task

Task 025 - Testes de integracao
