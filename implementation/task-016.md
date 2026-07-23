# Task 016 - Roles e permissions

## Objetivo

Implementar autorizacao por roles e permissions.

---

## Contexto

A spec define roles `USER` e `ADMIN`, permissions como `transactions:read` e decorators `@Roles()` e `@Permissions()`.

---

## Dependencias

* Task 015

---

## Arquivos envolvidos

Criar

* `src/common/guards/roles.guard.ts`
* `src/common/guards/permissions.guard.ts`
* `src/common/decorators/roles.decorator.ts`
* `src/common/decorators/permissions.decorator.ts`
* `src/modules/auth/entities/role.enum.ts`
* `src/modules/auth/entities/permission.enum.ts`
* `src/common/guards/tests/roles.guard.spec.ts`
* `src/common/guards/tests/permissions.guard.spec.ts`

Modificar

* `src/modules/auth/auth.service.ts`
* `src/modules/auth/interfaces/jwt-payload.interface.ts`
* `src/main.ts`

---

## Escopo

* [ ] Criar enums de roles e permissions.
* [ ] Incluir roles e permissions no payload JWT.
* [ ] Criar `RolesGuard`.
* [ ] Criar `PermissionsGuard`.
* [ ] Criar decorators customizados.
* [ ] Adicionar testes unitarios dos guards.

---

## Fora do escopo

* Nao criar painel admin.
* Nao criar novas roles alem das previstas.
* Nao criar endpoints financeiros.

---

## Criterios de aceite

* Guards validam roles e permissions.
* Payload JWT suporta autorizacao.
* Testes dos guards passam.
* Rotas protegidas continuam funcionando.

---

## Arquitetura envolvida

* Authorization
* Guards
* Decorators
* JWT Payload

---

## Observacoes

O escopo inicial pode usar `USER`, mas a estrutura deve permitir expansao para `ADMIN`.

---

## Proxima Task

Task 017 - CategoriesModule
