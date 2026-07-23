# Task 006 - Storage Seguro

## Objetivo

Implementar armazenamento seguro da sessao mobile.

## Contexto

No web a sessao fica em `localStorage`; no mobile deve usar storage seguro.

## Escopo

- [ ] Instalar/configurar `expo-secure-store`.
- [ ] Criar `SessionStorage`.
- [ ] Salvar access token, refresh token e usuario.
- [ ] Ler, atualizar e limpar sessao.

## Arquivos ou modulos envolvidos

- `apps/mobile/src/lib/storage/session-storage.ts`
- `apps/mobile/src/features/auth/session.types.ts`

## Criterios de aceite

- Sessao persiste entre aberturas do app.
- Logout limpa todos os dados.

## Dependencias

- Task 002.
- Task 004.

## Observacoes tecnicas

Nao usar AsyncStorage para tokens.

