# Task 003 - Configuracao de ambientes Angular

## Objetivo

Configurar ambientes Angular no app `apps/web` com `apiBaseUrl` apontando para o BFF.

---

## Contexto

A spec define que o frontend deve consumir `http://localhost:3000/api/v1` em desenvolvimento.

---

## Dependencias

* Task 001

---

## Arquivos envolvidos

Criar

* `apps/web/src/environments/environment.ts`
* `apps/web/src/environments/environment.development.ts`
* `apps/web/src/environments/environment.production.ts`

Modificar

* `apps/web/angular.json`

---

## Escopo

* [ ] Criar environment padrao.
* [ ] Criar environment de desenvolvimento com `apiBaseUrl`.
* [ ] Criar environment de producao com placeholder seguro.
* [ ] Configurar file replacements no Angular quando necessario.
* [ ] Garantir que build dev/prod reconhece environments.

---

## Fora do escopo

* Nao criar services HTTP.
* Nao alterar componentes.
* Nao implementar autenticacao.

---

## Criterios de aceite

* `environment.apiBaseUrl` disponivel para imports.
* `npm run web:build` compila apos a configuracao.

---

## Arquitetura envolvida

* Configuracao por ambiente.
* Separacao dev/prod.

---

## Observacoes

Manter `apiBaseUrl` com prefixo `/api/v1`.

---

## Proxima Task

Task 004 - HTTP base e modelos de API

