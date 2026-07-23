# Task 007 - AuthService

## Objetivo

Implementar service Angular para autenticar contra o BFF.

---

## Contexto

O frontend precisa registrar, logar, renovar sessao, encerrar sessao e obter usuario atual.

---

## Dependencias

* Task 006

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/core/auth/auth.service.ts`

Modificar

* Nenhum obrigatorio.

---

## Escopo

* [ ] Implementar `register`.
* [ ] Implementar `login`.
* [ ] Implementar `refresh`.
* [ ] Implementar `logout`.
* [ ] Implementar `getCurrentUser`.
* [ ] Implementar `restoreSession`.
* [ ] Atualizar `TokenStorageService` apos auth/refresh.

---

## Fora do escopo

* Nao criar interceptor.
* Nao criar componentes de login.
* Nao integrar rotas.

---

## Criterios de aceite

* Service consome `/auth/*` e `/users/me`.
* Service retorna dados desembrulhados de `ApiResponse<T>`.
* Falhas sao normalizadas ou propagadas de modo consistente.

---

## Arquitetura envolvida

* Auth API client.
* Token lifecycle.

---

## Observacoes

Evitar loop de refresh nesta camada; o controle automatico fica no interceptor.

---

## Proxima Task

Task 008 - Interceptor JWT e AuthGuard

