# Task 021 - Processamento de recorrencias

## Objetivo

Implementar processamento de recorrencias sem duplicar transacoes no mesmo mes.

---

## Contexto

A spec exige processamento seguro por periodo e criterio de conclusao: processar recorrencia sem duplicar no mesmo mes.

---

## Dependencias

* Task 020

---

## Arquivos envolvidos

Criar

* `src/modules/recurrences/dto/process-recurrences.dto.ts`
* `src/modules/recurrences/dto/process-recurrences-response.dto.ts`

Modificar

* `src/modules/recurrences/recurrences.service.ts`
* `src/modules/recurrences/recurrences.repository.ts`
* `src/modules/recurrences/recurrences.controller.ts`
* `src/modules/transactions/transactions.repository.ts`
* `src/modules/recurrences/tests/recurrences.service.spec.ts`

---

## Escopo

* [ ] Criar DTO de processamento por periodo.
* [ ] Buscar recorrencias ativas do usuario.
* [ ] Verificar se recorrencia ja foi processada no periodo.
* [ ] Criar transacoes correspondentes quando necessario.
* [ ] Atualizar controle de ultimo processamento.
* [ ] Garantir operacao atomica quando aplicavel.
* [ ] Expor endpoint protegido de processamento.
* [ ] Testar ausencia de duplicidade mensal.

---

## Fora do escopo

* Nao criar agendamento automatico.
* Nao criar filas.
* Nao criar dashboard.

---

## Criterios de aceite

* Recorrencias geram transacoes no periodo solicitado.
* Segunda execucao no mesmo periodo nao duplica transacoes.
* Operacao respeita `userId`.
* Testes unitarios cobrem duplicidade.

---

## Arquitetura envolvida

* Service Layer
* Repository Pattern
* Transactions financeiras
* Regras de negocio

---

## Observacoes

Usar transacao de banco se houver multiplas escritas dependentes.

---

## Proxima Task

Task 022 - DashboardModule
