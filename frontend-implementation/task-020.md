# Task 020 - Testes unitarios do frontend

## Objetivo

Adicionar cobertura unitária para os pontos criticos da integracao.

---

## Contexto

Mappers, auth, interceptor e facade concentram risco de contrato com o BFF.

---

## Dependencias

* Task 019

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/core/auth/*.spec.ts`
* `apps/web/src/app/finance/mappers/*.spec.ts`
* `apps/web/src/app/finance/services/*.spec.ts`
* `apps/web/src/app/services/finance.service.spec.ts`

Modificar

* `apps/web/src/app/app.component.spec.ts` se necessario.

---

## Escopo

* [ ] Testar `TokenStorageService`.
* [ ] Testar `AuthService` com `HttpTestingController`.
* [ ] Testar interceptor JWT/refresh.
* [ ] Testar mappers financeiros.
* [ ] Testar API services principais.
* [ ] Testar `FinanceService` com mocks dos API services.

---

## Fora do escopo

* Nao criar E2E automatizado com browser nesta etapa.
* Nao testar backend novamente.

---

## Criterios de aceite

* `npm run web:test` passa.
* Testes cobrem conversoes de mes e dinheiro.
* Testes cobrem token em requests protegidos.

---

## Arquitetura envolvida

* Angular testing.
* HTTP mocks.
* Mapper tests.

---

## Observacoes

Se Karma dificultar execucao no ambiente, registrar limitacao e ao menos garantir build.

---

## Proxima Task

Task 021 - Validacao integrada local

