# Task 013 - UsersModule base

## Objetivo

Criar modulo de usuarios com repository, service, DTOs e endpoint de perfil autenticado.

---

## Contexto

A spec inclui usuarios e perfil autenticado, alem do endpoint padrao `/users/me`. Este modulo tambem servira de base para autenticacao.

---

## Dependencias

* Task 008
* Task 012

---

## Arquivos envolvidos

Criar

* `src/modules/users/users.module.ts`
* `src/modules/users/users.controller.ts`
* `src/modules/users/users.service.ts`
* `src/modules/users/users.repository.ts`
* `src/modules/users/dto/user-response.dto.ts`
* `src/modules/users/entities/user.entity.ts`
* `src/modules/users/interfaces/user-repository.interface.ts`
* `src/modules/users/interfaces/user-service.interface.ts`
* `src/modules/users/mapper/user.mapper.ts`
* `src/modules/users/validators/user.validator.ts`
* `src/modules/users/tests/users.service.spec.ts`

Modificar

* `src/app.module.ts`

---

## Escopo

* [ ] Criar estrutura completa do modulo.
* [ ] Implementar repository para consultas de usuario.
* [ ] Implementar service para buscar usuario por ID e email.
* [ ] Criar mapper para response sem dados sensiveis.
* [ ] Criar controller com rota `/users/me`.
* [ ] Documentar rota no Swagger.

---

## Fora do escopo

* Nao implementar registro.
* Nao implementar login.
* Nao implementar JWT guard real.
* Nao criar roles e permissions.

---

## Criterios de aceite

* UsersModule registrado no AppModule.
* Service nao expoe senha ou tokens.
* Repository usa PrismaService.
* Teste unitario basico do service passa.

---

## Arquitetura envolvida

* Modularizacao NestJS
* Repository Pattern
* Service Layer
* Controller Layer
* DTO Layer

---

## Observacoes

Caso o guard real ainda nao exista, deixar a rota preparada para receber protecao na task de autenticacao.

---

## Proxima Task

Task 014 - AuthModule base
