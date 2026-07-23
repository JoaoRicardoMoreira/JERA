# Task 001 - Bootstrap do projeto NestJS

## Objetivo

Criar a base inicial do projeto NestJS com Node.js, TypeScript e scripts essenciais.

---

## Contexto

Esta etapa inicia o backend BFF definido na `spec.md`. Ela cria o ponto de partida para todos os modulos, configuracoes e camadas futuras.

---

## Dependencias

Nenhuma.

---

## Arquivos envolvidos

Criar

* `package.json`
* `package-lock.json`
* `nest-cli.json`
* `tsconfig.json`
* `tsconfig.build.json`
* `src/main.ts`
* `src/app.module.ts`

Modificar

* Nenhum.

---

## Escopo

* [ ] Inicializar projeto NestJS com TypeScript.
* [ ] Configurar scripts `start`, `start:dev`, `build`, `test`, `test:e2e`, `lint` e `format`.
* [ ] Criar `AppModule` minimo.
* [ ] Criar `main.ts` com bootstrap basico.
* [ ] Garantir que o projeto compile.

---

## Fora do escopo

* Nao criar modulos de negocio.
* Nao configurar Prisma.
* Nao configurar Docker.
* Nao implementar autenticacao.

---

## Criterios de aceite

* Projeto NestJS inicia localmente.
* `npm run build` executa com sucesso.
* Estrutura minima existe.
* Nenhum endpoint de negocio foi implementado.

---

## Arquitetura envolvida

* NestJS Modules
* TypeScript
* Bootstrap da aplicacao

---

## Observacoes

Manter a base simples. A configuracao global sera feita em tasks posteriores.

---

## Proxima Task

Task 002 - Estrutura de pastas base
