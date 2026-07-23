# Task 027 - Swagger completo dos modulos

## Objetivo

Revisar e completar a documentacao OpenAPI de todos os modulos.

---

## Contexto

A spec exige Swagger como parte obrigatoria da entrega, com tags por modulo, DTOs, exemplos, codigos HTTP e Bearer Auth.

---

## Dependencias

* Task 022
* Task 023

---

## Arquivos envolvidos

Criar

* Nenhum, salvo DTOs de response faltantes.

Modificar

* `src/config/swagger.config.ts`
* `src/modules/**/**.controller.ts`
* `src/modules/**/dto/*.dto.ts`

---

## Escopo

* [ ] Revisar tags Swagger por modulo.
* [ ] Documentar Bearer Auth em rotas protegidas.
* [ ] Adicionar exemplos em DTOs de request.
* [ ] Adicionar exemplos em DTOs de response.
* [ ] Documentar status HTTP esperados.
* [ ] Garantir endpoints padronizados sob `/api/v1`.

---

## Fora do escopo

* Nao criar novos endpoints.
* Nao alterar regras de negocio.
* Nao implementar testes novos.

---

## Criterios de aceite

* Todos os endpoints aparecem no Swagger.
* DTOs possuem exemplos.
* Bearer Auth esta configurado.
* Build passa.

---

## Arquitetura envolvida

* Swagger/OpenAPI
* DTO Layer
* Controller Layer
* Documentacao

---

## Observacoes

Swagger em producao deve continuar condicionado por configuracao.

---

## Proxima Task

Task 028 - Hardening de producao
