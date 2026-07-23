# Roadmap Mobile

## Visao Geral

| Task | Nome | Objetivo | Depende de | Complexidade | Estimativa | Status |
|---|---|---|---|---|---|---|
| 001 | Bootstrap Expo | Criar `apps/mobile` com Expo + TypeScript | - | Media | 3h | Pending |
| 002 | Configuracao base | Configurar scripts, env e aliases | 001 | Baixa | 2h | Pending |
| 003 | Assets e tema Jera | Portar logo, tokens e componentes visuais base | 001 | Media | 3h | Pending |
| 004 | Contratos BFF | Criar tipos e mappers compartilhados do mobile | 002 | Baixa | 2h | Pending |
| 005 | Cliente API | Criar HTTP client, erros e retry base | 002,004 | Media | 3h | Pending |
| 006 | Storage seguro | Implementar storage de sessao com SecureStore | 002,004 | Media | 3h | Pending |
| 007 | Auth service | Implementar login, registro, refresh, logout e usuario atual | 005,006 | Alta | 4h | Pending |
| 008 | Protecao de rotas | Criar layout auth/app e gate de sessao | 007 | Media | 3h | Pending |
| 009 | Navegacao principal | Criar tabs, stacks e tela Mais | 008 | Media | 3h | Pending |
| 010 | Componentes base | Criar screen/header/buttons/inputs/sheets/states | 003,009 | Media | 4h | Pending |
| 011 | Query/cache | Configurar React Query e invalidacoes | 005,008 | Media | 3h | Pending |
| 012 | Login/Register UI | Implementar telas de autenticacao | 007,010 | Media | 3h | Pending |
| 013 | Finance repository | Implementar repositorios de categorias, dashboard e transacoes | 011 | Media | 3h | Pending |
| 014 | Dashboard | Implementar dashboard mobile equivalente | 010,013 | Alta | 5h | Pending |
| 015 | Form de renda | Implementar bottom sheet de nova renda | 010,013 | Media | 3h | Pending |
| 016 | Tela de rendas | Implementar lista, total, empty, exclusao e criacao | 015 | Media | 4h | Pending |
| 017 | Form de gasto | Implementar bottom sheet de novo gasto | 010,013 | Media | 3h | Pending |
| 018 | Tela de gastos | Implementar total, categorias, lista, exclusao e criacao | 017 | Alta | 5h | Pending |
| 019 | Recorrentes API | Implementar repositorio e hooks de recorrentes | 011 | Media | 3h | Pending |
| 020 | Tela de recorrentes | Implementar lista, form, delete e processamento | 010,019 | Alta | 5h | Pending |
| 021 | Investimentos API | Implementar repositorio e hooks de investimentos | 011 | Media | 3h | Pending |
| 022 | Tela de investimentos | Implementar resumo, taxa, aporte, historico e grafico | 010,021 | Alta | 6h | Pending |
| 023 | Configuracoes | Implementar tela de configuracoes/logout | 007,010,009 | Baixa | 2h | Pending |
| 024 | QA e equivalencia | Testes, checklist e ajustes finais | 014,016,018,020,022,023 | Alta | 5h | Pending |

## Ondas de Execucao

Wave 1:

- Task 001

Wave 2:

- Task 002
- Task 003

Wave 3:

- Task 004

Wave 4:

- Task 005
- Task 006

Wave 5:

- Task 007

Wave 6:

- Task 008

Wave 7:

- Task 009
- Task 011

Wave 8:

- Task 010

Wave 9:

- Task 012
- Task 013
- Task 019
- Task 021

Wave 10:

- Task 014
- Task 015
- Task 017
- Task 020
- Task 022
- Task 023

Wave 11:

- Task 016
- Task 018

Wave 12:

- Task 024

## Tasks Bloqueantes

- Task 001 bloqueia todo o projeto mobile.
- Task 005 e Task 006 bloqueiam autenticacao.
- Task 007 bloqueia rotas protegidas.
- Task 008 bloqueia navegacao autenticada.
- Task 010 bloqueia telas com UI final.
- Task 011 bloqueia consumo consistente da API.
- Task 013 bloqueia dashboard, rendas e gastos.

## Tasks Paralelizaveis

- Task 002 e Task 003 podem ocorrer em paralelo apos Task 001.
- Task 005 e Task 006 podem ocorrer em paralelo apos Task 004.
- Task 009 e Task 011 podem ocorrer em paralelo apos Task 008.
- Task 012, Task 013, Task 019 e Task 021 podem ocorrer em paralelo apos suas dependencias.
- Task 014, Task 015, Task 017, Task 020, Task 022 e Task 023 podem ocorrer em paralelo desde que nao alterem os mesmos componentes base.
- Task 016 e Task 018 podem ocorrer em paralelo apos seus forms.

## Checklist de Equivalencia

- [ ] Auth mobile usa os mesmos endpoints do web.
- [ ] Tokens sao salvos em storage seguro.
- [ ] Refresh automatico funciona.
- [ ] Dashboard bate com web para mesmo usuario/mes/ano.
- [ ] Rendas batem com web.
- [ ] Gastos batem com web.
- [ ] Recorrentes batem com web.
- [ ] Investimentos batem com web.
- [ ] Permissoes batem com web.
- [ ] Estados vazios, erro e loading aparecem corretamente.
- [ ] Tema deep dark e logo Jera estao consistentes.
- [ ] App passa typecheck, lint e testes configurados.

