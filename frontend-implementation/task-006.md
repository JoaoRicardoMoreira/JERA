# Task 006 - TokenStorage e modelos de auth

## Objetivo

Criar modelos e service de armazenamento de tokens de autenticacao.

---

## Contexto

A integracao exige access token e refresh token para chamadas protegidas e renovacao de sessao.

---

## Dependencias

* Task 004

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/core/auth/auth.models.ts`
* `apps/web/src/app/core/auth/token-storage.service.ts`

Modificar

* Nenhum obrigatorio.

---

## Escopo

* [ ] Criar `AuthUser`.
* [ ] Criar `AuthResponse`.
* [ ] Criar requests de register/login/refresh/logout.
* [ ] Implementar `getAccessToken`.
* [ ] Implementar `getRefreshToken`.
* [ ] Implementar `setSession`.
* [ ] Implementar `clearSession`.
* [ ] Implementar `hasSession`.

---

## Fora do escopo

* Nao fazer chamadas HTTP.
* Nao criar interceptor.
* Nao criar UI de login.

---

## Criterios de aceite

* Tokens sao persistidos/limpos de forma centralizada.
* Nenhum componente acessa `localStorage` diretamente para sessao.

---

## Arquitetura envolvida

* Auth core.
* Session storage.

---

## Observacoes

Usar chaves com prefixo, por exemplo `financeControl.accessToken`.

---

## Proxima Task

Task 007 - AuthService

