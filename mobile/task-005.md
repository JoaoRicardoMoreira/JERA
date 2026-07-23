# Task 005 - Cliente API

## Objetivo

Implementar cliente HTTP mobile com base URL, bearer token e normalizacao de erro.

## Contexto

Todos os fluxos mobile dependem da API BFF atual.

## Escopo

- [ ] Criar instancia HTTP.
- [ ] Anexar `Authorization` quando houver access token.
- [ ] Normalizar erros da API para view model.
- [ ] Criar suporte a retry apos refresh, sem implementar auth service completo.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/lib/api/client.ts`
- `apps/mobile/src/lib/api/errors.ts`
- `apps/mobile/src/lib/api/api-response.ts`

## Criterios de aceite

- Cliente executa GET/POST/PUT/DELETE.
- Erros ficam padronizados para UI.

## Dependencias

- Task 002.
- Task 004.

## Observacoes tecnicas

Nao guardar tokens diretamente nesta task; usar contrato de storage da Task 006.

