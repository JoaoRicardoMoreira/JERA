# Task 008 - Interceptor JWT e AuthGuard

## Objetivo

Adicionar JWT automaticamente nas chamadas protegidas, tentar refresh em `401` e proteger rotas financeiras.

---

## Contexto

O BFF exige `Authorization: Bearer` em todos os endpoints financeiros.

---

## Dependencias

* Task 007

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/core/auth/auth.interceptor.ts`
* `apps/web/src/app/core/auth/auth.guard.ts`

Modificar

* `apps/web/src/app/app.config.ts`
* `apps/web/src/app/app.routes.ts`

---

## Escopo

* [ ] Registrar interceptor funcional ou provider equivalente.
* [ ] Ignorar endpoints publicos de auth.
* [ ] Adicionar Bearer token quando houver access token.
* [ ] Em `401`, tentar refresh uma unica vez.
* [ ] Limpar sessao se refresh falhar.
* [ ] Criar guard para rotas protegidas.

---

## Fora do escopo

* Nao criar UI de login.
* Nao alterar services financeiros.

---

## Criterios de aceite

* Chamadas protegidas enviam JWT.
* Refresh nao entra em loop.
* Rota protegida sem sessao redireciona ou bloqueia acesso.

---

## Arquitetura envolvida

* Angular Http Interceptor.
* Route guard.
* Auth core.

---

## Observacoes

Tratar concorrencia de varios `401` simultaneos com cuidado; se ficar complexo, serializar refresh.

---

## Proxima Task

Task 009 - Shell de autenticacao

