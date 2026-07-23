# Task 009 - Shell de autenticacao

## Objetivo

Criar fluxo visual minimo para login, registro e logout no app integrado.

---

## Contexto

O frontend atual nao possui tela de login mapeada. Sem sessao, o BFF nao permite acessar dados financeiros.

---

## Dependencias

* Task 008

---

## Arquivos envolvidos

Criar

* `apps/web/src/app/core/auth/login-page.component.ts`
* `apps/web/src/app/core/auth/login-page.component.html`

Modificar

* `apps/web/src/app/app.routes.ts`
* `apps/web/src/app/components/header/header.component.ts`
* `apps/web/src/app/components/header/header.component.html`

---

## Escopo

* [ ] Criar formulario de login.
* [ ] Criar alternativa simples de registro.
* [ ] Exibir erros de auth.
* [ ] Redirecionar para dashboard apos login.
* [ ] Adicionar acao de logout no header.

---

## Fora do escopo

* Nao redesenhar toda a aplicacao.
* Nao implementar recuperacao de senha.
* Nao criar novo endpoint.

---

## Criterios de aceite

* Usuario registra e entra.
* Usuario loga.
* Usuario desloga.
* Sem sessao, telas financeiras ficam protegidas.

---

## Arquitetura envolvida

* Auth UI.
* Angular routes.
* Header integration.

---

## Observacoes

Manter visual consistente com o app atual.

---

## Proxima Task

Task 010 - API services financeiros

