# Task 014 - AuthModule base

## Objetivo

Implementar registro, login, JWT access token e refresh token.

---

## Contexto

A spec define JWT stateless, refresh token persistido como hash, rotacao, logout e payload minimo com `sub`, `email`, `roles` e `permissions`.

---

## Dependencias

* Task 013

---

## Arquivos envolvidos

Criar

* `src/modules/auth/auth.module.ts`
* `src/modules/auth/auth.controller.ts`
* `src/modules/auth/auth.service.ts`
* `src/modules/auth/auth.repository.ts`
* `src/modules/auth/dto/register.dto.ts`
* `src/modules/auth/dto/login.dto.ts`
* `src/modules/auth/dto/auth-response.dto.ts`
* `src/modules/auth/dto/refresh-token.dto.ts`
* `src/modules/auth/entities/auth-session.entity.ts`
* `src/modules/auth/interfaces/auth-repository.interface.ts`
* `src/modules/auth/interfaces/jwt-payload.interface.ts`
* `src/modules/auth/mapper/auth.mapper.ts`
* `src/modules/auth/validators/auth.validator.ts`
* `src/modules/auth/tests/auth.service.spec.ts`

Modificar

* `src/app.module.ts`
* `src/modules/users/users.service.ts`
* `src/modules/users/users.repository.ts`
* `package.json`

---

## Escopo

* [ ] Criar endpoints de registro e login.
* [ ] Validar DTOs de auth.
* [ ] Hash de senha.
* [ ] Emitir access token.
* [ ] Criar e persistir refresh token como hash.
* [ ] Implementar refresh token.
* [ ] Implementar logout com revogacao.
* [ ] Documentar endpoints no Swagger.

---

## Fora do escopo

* Nao implementar guards de roles.
* Nao criar modulos financeiros.
* Nao implementar recuperacao de senha.

---

## Criterios de aceite

* Usuario registra com sucesso.
* Usuario faz login com sucesso.
* Access token contem payload minimo da spec.
* Refresh token nao e salvo puro.
* Logout revoga refresh token.
* Testes unitarios de auth passam.

---

## Arquitetura envolvida

* AuthModule
* JWT
* Refresh Token
* Repository Pattern
* Service Layer
* DTO Validation

---

## Observacoes

Nao logar senhas, access tokens ou refresh tokens.

---

## Proxima Task

Task 015 - Guards e decorators de autenticacao
