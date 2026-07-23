# Task 002 - Scripts e gitignore do monorepo

## Objetivo

Adicionar scripts no `package.json` raiz para executar backend e frontend integrado, e atualizar `.gitignore` para artefatos Angular.

---

## Contexto

Como a API fica na raiz e o frontend em `apps/web`, o monorepo precisa de comandos claros para desenvolvimento local.

---

## Dependencias

* Task 001

---

## Arquivos envolvidos

Criar

* Nenhum.

Modificar

* `package.json`
* `.gitignore`

---

## Escopo

* [ ] Adicionar script `web:start`.
* [ ] Adicionar script `web:build`.
* [ ] Adicionar script `web:test`.
* [ ] Adicionar script `dev:api`.
* [ ] Adicionar script `dev:web`.
* [ ] Opcionalmente adicionar `dev:all` se houver dependencia adequada.
* [ ] Ignorar `apps/web/node_modules`, `apps/web/dist`, `apps/web/.angular`.

---

## Fora do escopo

* Nao instalar novas dependencias root sem necessidade.
* Nao configurar Nx/Turborepo nesta etapa.
* Nao alterar codigo Angular.

---

## Criterios de aceite

* Scripts root chamam comandos em `apps/web`.
* `npm run web:build` fica preparado para execucao.
* Artefatos Angular nao aparecem como arquivos versionaveis.

---

## Arquitetura envolvida

* Monorepo simples por scripts npm.

---

## Observacoes

Evitar introduzir ferramenta de workspace pesada antes de a integracao estar estavel.

---

## Proxima Task

Task 003 - Configuracao de ambientes Angular

