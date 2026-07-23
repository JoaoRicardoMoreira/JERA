# Execution Plan - Integracao Frontend em Monorepo

## 1. Mapa de dependencias

| Task | Nome | Depende de | Bloqueia | Arquivos envolvidos | Risco de conflito |
| --- | --- | --- | --- | --- | --- |
| 001 | Preparacao do monorepo web | - | 002,003 | `apps/web/**` | Alto se outra task iniciar antes da copia |
| 002 | Scripts e gitignore do monorepo | 001 | - | `package.json`, `.gitignore` | Alto: arquivos globais |
| 003 | Configuracao de ambientes Angular | 001 | 004 | `apps/web/angular.json`, `apps/web/src/environments/**` | Medio |
| 004 | HTTP base e modelos de API | 003 | 005,006 | `apps/web/src/app/app.config.ts`, `core/api/**` | Medio |
| 005 | Modelos BFF e ViewModels financeiros | 004 | 010,011 | `apps/web/src/app/finance/models/**` | Baixo |
| 006 | TokenStorage e modelos de auth | 004 | 007 | `apps/web/src/app/core/auth/**` | Medio |
| 007 | AuthService | 006 | 008 | `apps/web/src/app/core/auth/auth.service.ts` | Medio |
| 008 | Interceptor JWT e AuthGuard | 007 | 009,010,019 | `app.config.ts`, `app.routes.ts`, `core/auth/**` | Alto: config global |
| 009 | Shell de autenticacao | 008 | - | `core/auth/*page*`, `app.routes.ts`, header | Alto: rotas/header |
| 010 | API services financeiros | 005,008 | 012,013,014,015,016,017,018 | `finance/services/**` | Baixo |
| 011 | Mappers financeiros | 005 | 012,013,014,015,016,017 | `finance/mappers/**` | Baixo |
| 012 | Store de UI sem localStorage financeiro | 010,011 | 013,014,015,016,017,018,019 | `finance.store.ts`, `finance.service.ts`, models | Alto: facade central |
| 013 | Categorias do BFF nos formularios | 010,011,012 | 014,016,017 | formularios e modais | Alto: componentes compartilhados |
| 014 | Transacoes via BFF | 010,011,012,013 | 015,017,018,019 | `FinanceService`, store, history tabs | Alto |
| 015 | Dashboard e graficos via BFF | 010,011,012,014 | 016,019 | summary/charts/store/service | Medio |
| 016 | Metas via BFF | 010,011,012,013,015 | 019 | metas/modal/service/store | Medio |
| 017 | Recorrencias via BFF | 010,011,012,013,014 | 019 | recurrence modal/service/store | Medio |
| 018 | CSV via BFF | 010,012,014 | 019 | header/service/csv util | Medio |
| 019 | Erros, loading e permissoes | 008,012,014,015,016,017,018 | 020 | store/service/components/core auth | Alto |
| 020 | Testes unitarios do frontend | 019 | 021 | `*.spec.ts` | Baixo |
| 021 | Validacao integrada local | 020 | 022 | ajustes pontuais | Medio |
| 022 | Documentacao operacional | 021 | - | `docs/**`, `README.md` | Baixo |

## 2. Ondas de execucao paralela

### Wave 1

- task-001

Observacao: nada deve rodar em paralelo com a copia inicial porque `apps/web` ainda nao existe.

### Wave 2

- task-002
- task-003

Podem rodar em paralelo se task-002 tocar apenas root e task-003 tocar apenas Angular app.

### Wave 3

- task-004

Bloqueia modelos/auth base.

### Wave 4

- task-005
- task-006

Podem rodar em paralelo: modelos financeiros e auth storage nao compartilham arquivos.

### Wave 5

- task-007
- task-011

Podem rodar em paralelo: auth service e mappers financeiros separados.

### Wave 6

- task-008
- task-010

Podem rodar em paralelo com cuidado. Task-008 toca config/rotas/auth; task-010 toca `finance/services/**`.

### Wave 7

- task-009
- task-012

Conflito potencial em `FinanceService` e rotas e baixo se task-009 ficar em auth/header. Se task-009 precisar de `FinanceService`, pausar ate task-012.

### Wave 8

- task-013

Categoria desbloqueia transacoes, metas e recorrencias.

### Wave 9

- task-014

Transacoes e central e deve rodar isolada.

### Wave 10

- task-015
- task-017
- task-018

Podem rodar em paralelo se locks forem respeitados:

- dashboard/charts
- recurrence modal/service
- header/csv

Se todos precisarem editar `FinanceService`/`FinanceStore`, serializar esses trechos.

### Wave 11

- task-016

Metas depende de categorias e dashboard.

### Wave 12

- task-019

Consolida UX, loading e permissoes.

### Wave 13

- task-020

Testes unitarios.

### Wave 14

- task-021

Validacao integrada.

### Wave 15

- task-022

Documentacao operacional.

## 3. Alocacao de agentes

### Agent: monorepo-bootstrap-agent

Task: task-001

Pode alterar:

- `apps/web/**`

Nao pode alterar:

- `src/**`
- `prisma/**`
- `package.json`
- `.gitignore`

Dependencias:

- Nenhuma

Criterios:

- Copia criada sem artefatos pesados.
- Front legado intacto.

### Agent: root-scripts-agent

Task: task-002

Pode alterar:

- `package.json`
- `.gitignore`

Nao pode alterar:

- `apps/web/src/**`
- `src/**`

Dependencias:

- task-001

Criterios:

- Scripts root funcionais.
- Artefatos Angular ignorados.

### Agent: angular-env-agent

Task: task-003

Pode alterar:

- `apps/web/angular.json`
- `apps/web/src/environments/**`

Nao pode alterar:

- `package.json`
- `apps/web/src/app/**`

Dependencias:

- task-001

Criterios:

- Environments criados e build preparado.

### Agent: api-core-agent

Task: task-004

Pode alterar:

- `apps/web/src/app/core/api/**`
- `apps/web/src/app/app.config.ts`

Nao pode alterar:

- `apps/web/src/app/core/auth/**`
- `apps/web/src/app/finance/**`

Dependencias:

- task-003

Criterios:

- HttpClient habilitado.
- Tipos de API criados.

### Agent: finance-models-agent

Task: task-005

Pode alterar:

- `apps/web/src/app/finance/models/**`

Nao pode alterar:

- `apps/web/src/app/services/finance.service.ts`
- `apps/web/src/app/state/finance.store.ts`

Dependencias:

- task-004

Criterios:

- Contratos e ViewModels tipados.

### Agent: auth-storage-agent

Task: task-006

Pode alterar:

- `apps/web/src/app/core/auth/auth.models.ts`
- `apps/web/src/app/core/auth/token-storage.service.ts`

Nao pode alterar:

- `apps/web/src/app/core/auth/auth.service.ts`
- `apps/web/src/app/app.config.ts`

Dependencias:

- task-004

Criterios:

- Tokens centralizados.

### Agent: auth-service-agent

Task: task-007

Pode alterar:

- `apps/web/src/app/core/auth/auth.service.ts`

Nao pode alterar:

- `apps/web/src/app/app.config.ts`
- `apps/web/src/app/app.routes.ts`

Dependencias:

- task-006

Criterios:

- Endpoints de auth consumidos.

### Agent: auth-guard-agent

Task: task-008

Pode alterar:

- `apps/web/src/app/core/auth/auth.interceptor.ts`
- `apps/web/src/app/core/auth/auth.guard.ts`
- `apps/web/src/app/app.config.ts`
- `apps/web/src/app/app.routes.ts`

Nao pode alterar:

- `apps/web/src/app/services/finance.service.ts`
- `apps/web/src/app/finance/services/**`

Dependencias:

- task-007

Criterios:

- JWT e refresh funcionando.

### Agent: auth-ui-agent

Task: task-009

Pode alterar:

- `apps/web/src/app/core/auth/*page*`
- `apps/web/src/app/app.routes.ts`
- `apps/web/src/app/components/header/**`

Nao pode alterar:

- `apps/web/src/app/state/finance.store.ts`
- `apps/web/src/app/finance/services/**`

Dependencias:

- task-008

Criterios:

- Login/register/logout visual funcionando.

### Agent: finance-api-agent

Task: task-010

Pode alterar:

- `apps/web/src/app/finance/services/**`

Nao pode alterar:

- `apps/web/src/app/services/finance.service.ts`
- `apps/web/src/app/state/finance.store.ts`
- `apps/web/src/app/components/**`

Dependencias:

- task-005
- task-008

Criterios:

- API services criados.

### Agent: finance-mappers-agent

Task: task-011

Pode alterar:

- `apps/web/src/app/finance/mappers/**`

Nao pode alterar:

- `apps/web/src/app/services/finance.service.ts`
- `apps/web/src/app/components/**`

Dependencias:

- task-005

Criterios:

- Conversoes centralizadas.

### Agent: finance-store-agent

Task: task-012

Pode alterar:

- `apps/web/src/app/state/finance.store.ts`
- `apps/web/src/app/models/finance-state.ts`
- `apps/web/src/app/services/finance.service.ts`

Nao pode alterar:

- `apps/web/src/app/components/**`

Dependencias:

- task-010
- task-011

Criterios:

- Store nao usa localStorage financeiro como fonte principal.

### Agent: categories-ui-agent

Task: task-013

Pode alterar:

- Formularios e modais que selecionam categorias.
- `apps/web/src/app/services/finance.service.ts`

Nao pode alterar:

- `apps/web/src/app/finance/services/**`
- Backend root `src/**`

Dependencias:

- task-010
- task-011
- task-012

Criterios:

- UI usa `categoryId`.

### Agent: transactions-ui-agent

Task: task-014

Pode alterar:

- `apps/web/src/app/services/finance.service.ts`
- `apps/web/src/app/state/finance.store.ts`
- `apps/web/src/app/app.component.ts`
- `apps/web/src/app/components/history-tabs/**`

Nao pode alterar:

- Auth core.
- Backend.

Dependencias:

- task-010
- task-011
- task-012
- task-013

Criterios:

- Transacoes persistem e deletam por UUID.

### Agent: dashboard-ui-agent

Task: task-015

Pode alterar:

- Summary cards.
- Charts panel.
- `FinanceService`/store apenas para dashboard.

Nao pode alterar:

- Modais de metas/recorrencias.

Dependencias:

- task-010
- task-011
- task-012
- task-014

Criterios:

- Dashboard usa BFF.

### Agent: goals-ui-agent

Task: task-016

Pode alterar:

- Metas component/modal.
- `FinanceService`/store apenas para metas.

Nao pode alterar:

- Recurrence modal.
- Header CSV.

Dependencias:

- task-010
- task-011
- task-012
- task-013
- task-015

Criterios:

- Metas usam `categoryId`.

### Agent: recurrences-ui-agent

Task: task-017

Pode alterar:

- Recurrence modal.
- `FinanceService`/store apenas para recorrencias.

Nao pode alterar:

- Header CSV.
- Metas component.

Dependencias:

- task-010
- task-011
- task-012
- task-013
- task-014

Criterios:

- Recorrencias via BFF.

### Agent: csv-ui-agent

Task: task-018

Pode alterar:

- Header CSV.
- CSV util.
- `FinanceService` apenas export/import.

Nao pode alterar:

- Recurrence modal.
- Metas component.

Dependencias:

- task-010
- task-012
- task-014

Criterios:

- CSV usa BFF.

### Agent: ux-state-agent

Task: task-019

Pode alterar:

- Store.
- FinanceService.
- Componentes de feedback.
- `permission.service.ts`

Nao pode alterar:

- API services, salvo correcao pequena.

Dependencias:

- task-008
- task-012
- task-014
- task-015
- task-016
- task-017
- task-018

Criterios:

- Loading/erro/permissoes consistentes.

### Agent: frontend-tests-agent

Task: task-020

Pode alterar:

- `apps/web/src/app/**/*.spec.ts`

Nao pode alterar:

- Implementacao, salvo bug pequeno descoberto e registrado.

Dependencias:

- task-019

Criterios:

- Testes unitarios passam.

### Agent: fullstack-validation-agent

Task: task-021

Pode alterar:

- Ajustes pontuais em `apps/web/**`
- Documentar achados no status.

Nao pode alterar:

- Front legado.

Dependencias:

- task-020

Criterios:

- Fluxo manual integrado passa.

### Agent: docs-agent

Task: task-022

Pode alterar:

- `docs/**`
- `README.md`

Nao pode alterar:

- Codigo de aplicacao.

Dependencias:

- task-021

Criterios:

- Runbook claro do monorepo.

## 4. Validacao por wave

Validacoes minimas:

- Apos Wave 2: `npm run web:build`.
- Apos Wave 4: `npm run web:build`.
- Apos Wave 6: `npm run web:build`.
- Apos Wave 9: `npm run web:build`.
- Apos Wave 12: `npm run web:build`.
- Apos Wave 13: `npm run web:test` quando Karma estiver operacional.
- Apos Wave 14: fluxo manual com backend real.

Se uma validacao falhar, nao avancar para a proxima wave antes de corrigir.

