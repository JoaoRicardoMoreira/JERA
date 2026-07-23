# Task 026 - Testes E2E principais

## Objetivo

Cobrir fluxos HTTP ponta a ponta usados pelo front-end.

---

## Contexto

A spec exige Jest + Supertest para registro/login, refresh token, criar despesa, criar receita, dashboard, meta, recorrencia e exclusao com isolamento por usuario.

---

## Dependencias

* Task 022
* Task 023
* Task 025

---

## Arquivos envolvidos

Criar

* `test/app.e2e-spec.ts`
* `test/auth.e2e-spec.ts`
* `test/finance-flow.e2e-spec.ts`
* `test/helpers/e2e-app.helper.ts`
* `test/helpers/auth.helper.ts`

Modificar

* `package.json`
* Configuracao E2E existente, se necessario.

---

## Escopo

* [ ] Configurar Supertest.
* [ ] Testar registro e login.
* [ ] Testar refresh token.
* [ ] Testar criacao de receita.
* [ ] Testar criacao de despesa.
* [ ] Testar criacao de meta.
* [ ] Testar criacao de recorrencia.
* [ ] Testar dashboard.
* [ ] Testar exclusao com isolamento multiusuario.

---

## Fora do escopo

* Nao criar novas funcionalidades.
* Nao testar UI.
* Nao alterar contratos sem necessidade.

---

## Criterios de aceite

* `npm run test:e2e` passa.
* Fluxo financeiro principal esta coberto.
* Isolamento multiusuario e validado.
* Testes unitarios e de integracao continuam passando.

---

## Arquitetura envolvida

* E2E Testing
* Supertest
* Auth
* BFF endpoints

---

## Observacoes

Os testes devem usar dados descartaveis e nao depender de ordem externa.

---

## Proxima Task

Task 027 - Swagger completo dos modulos
