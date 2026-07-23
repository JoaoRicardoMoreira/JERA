# Task 001 - Preparacao do monorepo web

## Objetivo

Criar o novo frontend integrado dentro deste repositorio, em `apps/web`, copiando a aplicacao Angular existente sem modificar a pasta original.

---

## Contexto

O frontend antigo continua em uso para outros fins e deve permanecer intacto. A integracao com o BFF sera feita em uma copia local ao monorepo para desenvolvimento conjunto.

---

## Dependencias

Nenhuma.

---

## Arquivos envolvidos

Criar

* `apps/web/**`

Modificar

* Nenhum arquivo do frontend original.

---

## Escopo

* [ ] Criar diretorio `apps/web`.
* [ ] Copiar conteudo de `C:\Users\joao\Documents\projetos\FinanceControl\FinanceControlFront` para `apps/web`.
* [ ] Nao copiar `node_modules`, `dist`, `.angular` e artefatos de cache.
* [ ] Preservar estrutura Angular original dentro de `apps/web`.
* [ ] Confirmar que a pasta original nao foi modificada.

---

## Fora do escopo

* Nao integrar API.
* Nao alterar backend.
* Nao criar tela de login.
* Nao mover o backend para `apps/api`.

---

## Criterios de aceite

* `apps/web/package.json` existe.
* `apps/web/src/app` existe.
* Frontend original permanece sem alteracoes.
* `apps/web` nao contem `node_modules` nem `dist`.

---

## Arquitetura envolvida

* Monorepo de desenvolvimento.
* Isolamento entre copia integrada e frontend legado.

---

## Observacoes

Manter o backend na raiz reduz risco neste momento. O monorepo inicial sera hibrido: API na raiz e web em `apps/web`.

---

## Proxima Task

Task 002 - Scripts e gitignore do monorepo

