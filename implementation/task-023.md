# Task 023 - ImportExportModule CSV

## Objetivo

Implementar importacao e exportacao CSV no backend.

---

## Contexto

A spec define migrar a logica CSV do front-end para o backend e expor `POST /import-export/csv/import` e `GET /import-export/csv/export`.

---

## Dependencias

* Task 018

---

## Arquivos envolvidos

Criar

* `src/modules/import-export/import-export.module.ts`
* `src/modules/import-export/import-export.controller.ts`
* `src/modules/import-export/import-export.service.ts`
* `src/modules/import-export/dto/import-csv-response.dto.ts`
* `src/modules/import-export/dto/export-csv-query.dto.ts`
* `src/modules/import-export/interfaces/csv-row.interface.ts`
* `src/modules/import-export/mapper/csv.mapper.ts`
* `src/modules/import-export/validators/csv.validator.ts`
* `src/modules/import-export/tests/import-export.service.spec.ts`

Modificar

* `src/app.module.ts`
* `src/modules/transactions/transactions.service.ts`
* `src/modules/transactions/transactions.repository.ts`

---

## Escopo

* [ ] Criar modulo de import/export.
* [ ] Criar endpoint de exportacao CSV.
* [ ] Criar endpoint de importacao CSV.
* [ ] Validar formato do CSV.
* [ ] Garantir que dados importados pertencam ao usuario autenticado.
* [ ] Retornar erros claros para CSV invalido.
* [ ] Documentar endpoints no Swagger.

---

## Fora do escopo

* Nao suportar formatos alem de CSV.
* Nao criar storage externo.
* Nao criar filas.

---

## Criterios de aceite

* Exportacao retorna apenas dados do usuario.
* Importacao valida formato antes de persistir.
* Importacao nao mistura dados entre usuarios.
* Teste unitario do service passa.

---

## Arquitetura envolvida

* ImportExportModule
* Validators
* Mappers
* TransactionsModule
* BFF

---

## Observacoes

Nao logar conteudo financeiro completo durante importacao ou exportacao.

---

## Proxima Task

Task 024 - Testes unitarios
