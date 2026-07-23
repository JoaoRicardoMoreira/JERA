# Task 021 - Validacao integrada local

## Objetivo

Validar frontend integrado contra backend e PostgreSQL reais.

---

## Contexto

O backend ja foi validado com banco real. A integracao final precisa provar o fluxo completo no navegador.

---

## Dependencias

* Task 020

---

## Arquivos envolvidos

Criar

* Nenhum obrigatorio.

Modificar

* Ajustes pequenos encontrados durante validacao.

---

## Escopo

* [ ] Garantir backend rodando em `localhost:3000`.
* [ ] Garantir Postgres principal e teste quando aplicavel.
* [ ] Rodar migrations/seed se necessario.
* [ ] Rodar `npm run web:build`.
* [ ] Rodar testes frontend.
* [ ] Executar fluxo manual completo.
* [ ] Registrar falhas e corrigir dentro do escopo da integracao.

---

## Fora do escopo

* Nao publicar deploy.
* Nao mexer no frontend legado.

---

## Criterios de aceite

* Usuario registra/login/logout.
* Receita/despesa persistem.
* Dashboard/graficos atualizam.
* Metas, recorrencias e CSV funcionam contra BFF.

---

## Arquitetura envolvida

* Full-stack local.
* Monorepo development flow.

---

## Observacoes

Se Docker nao estiver acessivel ao Codex, usar containers ja iniciados pelo usuario e validar pelas portas.

---

## Proxima Task

Task 022 - Documentacao operacional

