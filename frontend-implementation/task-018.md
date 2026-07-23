# Task 018 - CSV via BFF

## Objetivo

Migrar importacao e exportacao CSV do frontend local para endpoints do BFF.

---

## Contexto

Hoje o frontend monta e parseia CSV no navegador. O BFF ja possui validacao e persistencia centralizada.

---

## Dependencias

* Task 010
* Task 012
* Task 014

---

## Arquivos envolvidos

Criar

* Nenhum obrigatorio.

Modificar

* `apps/web/src/app/services/finance.service.ts`
* `apps/web/src/app/components/header/header.component.ts`
* `apps/web/src/app/components/header/header.component.html`
* `apps/web/src/app/utils/csv.ts`

---

## Escopo

* [ ] Exportar CSV via `GET /import-export/csv/export`.
* [ ] Baixar `Blob` retornado pela API.
* [ ] Importar CSV via multipart `POST /import-export/csv/import`.
* [ ] Recarregar dados apos importacao.
* [ ] Remover uso de `parseCsv` e `toCsv` como fonte principal.

---

## Fora do escopo

* Nao alterar formato CSV do BFF.
* Nao criar preview de importacao.

---

## Criterios de aceite

* Export baixa arquivo vindo do backend.
* Import persiste dados no backend.
* Refresh da pagina mantem dados importados.

---

## Arquitetura envolvida

* ImportExport API.
* Browser file upload/download.

---

## Observacoes

Nao setar manualmente `Content-Type` ao enviar `FormData`; o browser define boundary.

---

## Proxima Task

Task 019 - Erros, loading e permissoes

