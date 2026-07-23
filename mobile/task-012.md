# Task 012 - Login e Registro UI

## Objetivo

Implementar telas de login e registro com a identidade Jera.

## Contexto

Equivale ao `/login` web, adaptado para teclado e tela pequena.

## Escopo

- [ ] Tela de login.
- [ ] Tela de registro.
- [ ] Logo Jera no topo.
- [ ] Campos: nome no registro, email, senha.
- [ ] Loading e erro.
- [ ] Navegacao apos sucesso.

## Arquivos ou modulos envolvidos

- `apps/mobile/app/(auth)/login.tsx`
- `apps/mobile/app/(auth)/register.tsx`
- `apps/mobile/src/features/auth/**`

## Criterios de aceite

- Login funciona contra API.
- Registro funciona contra API.
- Erros de credencial/validacao aparecem.

## Dependencias

- Task 007.
- Task 010.

## Observacoes tecnicas

Usar `KeyboardAvoidingView`.

