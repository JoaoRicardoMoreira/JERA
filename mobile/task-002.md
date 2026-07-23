# Task 002 - Configuracao Base

## Objetivo

Configurar scripts, ambientes e aliases do app mobile.

## Contexto

O mobile precisa alternar API local, emulador e producao sem alterar codigo.

## Escopo

- [ ] Criar `src/config/env.ts`.
- [ ] Definir `API_BASE_URL`.
- [ ] Configurar aliases de import.
- [ ] Adicionar scripts `mobile:start`, `mobile:typecheck`, `mobile:test`, `mobile:lint`.

## Arquivos ou modulos envolvidos

- `apps/mobile/package.json`
- `apps/mobile/tsconfig.json`
- `apps/mobile/src/config/env.ts`
- `package.json`

## Criterios de aceite

- Scripts executam.
- App consegue ler base URL por ambiente.

## Dependencias

- Task 001.

## Observacoes tecnicas

Considerar que em dispositivo fisico `localhost` nao aponta para a maquina da API.

