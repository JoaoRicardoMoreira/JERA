# Task 015 - Guards e decorators de autenticacao

## Objetivo

Implementar guard JWT e decorators `@CurrentUser()` e `@Public()`.

---

## Contexto

A spec define que todos os endpoints protegidos devem exigir JWT e que rotas publicas devem ser marcadas explicitamente.

---

## Dependencias

* Task 014

---

## Arquivos envolvidos

Criar

* `src/common/guards/jwt-auth.guard.ts`
* `src/common/decorators/current-user.decorator.ts`
* `src/common/decorators/public.decorator.ts`

Modificar

* `src/main.ts`
* `src/modules/auth/auth.controller.ts`
* `src/modules/users/users.controller.ts`
* `src/common/interfaces/request-user.interface.ts`

---

## Escopo

* [ ] Criar `JwtAuthGuard`.
* [ ] Validar access token em rotas protegidas.
* [ ] Criar decorator `@CurrentUser()`.
* [ ] Criar decorator `@Public()`.
* [ ] Marcar rotas de auth publicas.
* [ ] Proteger `/users/me`.

---

## Fora do escopo

* Nao implementar roles.
* Nao implementar permissions.
* Nao criar modulos financeiros.

---

## Criterios de aceite

* Rotas protegidas rejeitam request sem JWT.
* Rotas publicas continuam acessiveis.
* `@CurrentUser()` retorna dados do usuario autenticado.
* Build e testes relacionados passam.

---

## Arquitetura envolvida

* Guards
* Decorators
* JWT Authentication
* Request User

---

## Observacoes

O payload deve conter apenas dados necessarios para autorizacao e identificacao.

---

## Proxima Task

Task 016 - Roles e permissions
