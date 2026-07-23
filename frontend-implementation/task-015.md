# Task 015 - Dashboard e graficos via BFF

## Objetivo

Substituir calculos locais de resumo e graficos por endpoints agregados do BFF.

---

## Contexto

O BFF foi criado exatamente para entregar dados prontos para telas, evitando calculos duplicados no frontend.

---

## Dependencias

* Task 010
* Task 011
* Task 012
* Task 014

---

## Arquivos envolvidos

Criar

* Nenhum obrigatorio.

Modificar

* `apps/web/src/app/services/finance.service.ts`
* `apps/web/src/app/state/finance.store.ts`
* `apps/web/src/app/components/summary-cards/summary-cards.component.ts`
* `apps/web/src/app/components/charts-panel/charts-panel.component.ts`

---

## Escopo

* [ ] Chamar `GET /dashboard/monthly-summary`.
* [ ] Chamar `GET /dashboard/charts`.
* [ ] Mapear summary para cards atuais.
* [ ] Mapear charts para Chart.js atual.
* [ ] Recarregar dashboard ao mudar mes/ano.
* [ ] Recarregar dashboard apos transacoes.

---

## Fora do escopo

* Nao criar endpoints anuais.
* Nao redesenhar graficos.

---

## Criterios de aceite

* Cards exibem dados vindos do BFF.
* Graficos exibem dados vindos do BFF.
* Calculo local de totais deixa de ser fonte principal.

---

## Arquitetura envolvida

* Dashboard BFF.
* Presentation mapping.

---

## Observacoes

Para `month='all'`, definir comportamento de UI antes de chamar endpoints mensais.

---

## Proxima Task

Task 016 - Metas via BFF

