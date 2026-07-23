# Agent Status

## Running

| Agent | Task | Status | Files Locked |
|---|---|---|---|

## Pending

| Task | Blocked By | Reason |
|---|---|---|

## Completed

| Task | Agent | Summary | Validation |
|---|---|---|---|
| task-001 | orchestrator | Frontend Angular legado copiado para `apps/web` sem `node_modules`, `dist`, `.angular` ou `.git`. A pasta original nao foi modificada por esta task; ela ja possuia alteracoes locais preexistentes. | Verificado que `apps/web/package.json` e `apps/web/src/app` existem e que artefatos pesados nao foram copiados. |
| task-002 | root-scripts-agent | Scripts root adicionados para executar backend/frontend (`dev:api`, `dev:web`, `web:start`, `web:build`, `web:test`) e `.gitignore` atualizado para artefatos Angular em `apps/web`. | `npm --prefix apps/web install --cache .npm-cache` executado com sucesso. `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. `ng build` falhou no sandbox por acesso negado ao tentar ler diretorios acima da workspace (`../../../..`), nao por erro TypeScript. |
| task-003 | angular-env-agent | Environments Angular criados com `apiBaseUrl` dev/prod e file replacements configurados em `apps/web/angular.json`. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. `ng build` segue bloqueado pelo sandbox com `Cannot read directory '../../../..': Acesso negado`. |
| task-004 | api-core-agent | `HttpClient` habilitado no Angular e tipos comuns `ApiResponse`, `PaginatedData`, `ApiErrorResponse`, `ApiErrorViewModel` e `normalizeApiError` criados. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-005 | finance-models-agent | Contratos TypeScript do BFF e ViewModels financeiros criados em `apps/web/src/app/finance/models`. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-006 | auth-storage-agent | Modelos de autenticacao e `TokenStorageService` criados com armazenamento centralizado de access token, refresh token e usuario. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-007 | auth-service-agent | `AuthService` criado para register, login, refresh, logout, users/me e restoreSession, desembrulhando `ApiResponse<T>` e atualizando `TokenStorageService`. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-011 | finance-mappers-agent | Mappers financeiros criados para transacoes, dashboard, metas, recorrencias e conversao de mes UI/API. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-008 | auth-guard-agent | Interceptor HTTP registrado no Angular, envio de Bearer token habilitado, refresh token automatico em 401 e guard funcional por sessao criados. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-010 | finance-api-agent | Services de API financeiros criados para categorias, transacoes, dashboard, metas, recorrencias e import/export CSV. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-009 | auth-ui-agent | Shell de autenticacao criado com rota `/login`, formulario de login/registro, logout no header e dashboard movido para rota protegida por `authGuard`. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-012 | finance-store-agent | `FinanceStore` deixou de persistir dados financeiros em `localStorage` e passou a manter estado/cache de UI em memoria; `FinanceService` passou a orquestrar carregamento inicial via services do BFF. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-013 | categories-form-agent | Formularios de despesa, renda e recorrencia passaram a receber categorias do BFF, filtrar por tipo e emitir `categoryId` mantendo nome apenas para exibicao. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-014 | transactions-agent | Criacao/listagem de transacoes ficaram ligadas ao BFF, o historico passou a excluir por UUID e o store separa receitas/despesas pelo tipo vindo do mapper. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-015 | dashboard-agent | Dashboard mensal e graficos usam `GET /dashboard/monthly-summary` e `GET /dashboard/charts`; cards passaram a consumir progresso/excesso de metas vindos do BFF. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-016 | goals-agent | Metas mensais passaram a usar `GET /goals` e `PUT /goals` por `categoryId`; componente de metas lista categorias de despesa e exibe progresso vindo do BFF. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-017 | recurrences-agent | Recorrencias passaram a criar/listar/excluir/processar pelo BFF; processamento local automatico permanece removido e o modal aciona `POST /recurrences/process`. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-018 | csv-agent | Importacao/exportacao CSV migradas para `ImportExportApiService`; export baixa `Blob` do BFF e import envia `FormData` multipart e recarrega a view. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-019 | ux-state-agent | Estado de loading foi separado por escopo, erros normalizados ganharam mensagens amigaveis, `PermissionService` foi criado e formularios principais bloqueiam submit durante mutacoes. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. |
| task-020 | frontend-tests-agent | Specs adicionados para token storage, interceptor JWT, mappers financeiros, categories API service e shell raiz. `app.component.spec.ts` foi ajustado para a arquitetura roteada. | `npx.cmd tsc -p apps/web/tsconfig.spec.json --noEmit` passou. `npm run web:test -- --watch=false --browsers=ChromeHeadless` gerou bundle, mas Chrome falhou no ambiente por erro de GPU/processo; processos Node do Karma foram encerrados. |
| task-021 | integration-validation-agent | Validacao local possivel no sandbox executada: tipagem da aplicacao e dos specs passou. Build Angular e Karma foram tentados. | `npx.cmd tsc -p apps/web/tsconfig.app.json --noEmit` passou. `npx.cmd tsc -p apps/web/tsconfig.spec.json --noEmit` passou. `npm run web:build` falhou por restricao do sandbox ao ler `../../../..` e resolver `main.ts`, `zone.js` e `src/styles.css`. `npm run web:test -- --watch=false --browsers=ChromeHeadless` falhou porque o Chrome do ambiente nao iniciou por erro de GPU/processo. Validacao manual em navegador real ficou pendente fora do sandbox. |
| task-022 | runbook-agent | Runbook operacional criado em `docs/frontend-integration-runbook.md` e README curto criado apontando estrutura do monorepo, comandos, envs, portas, validacao local e preservacao do frontend legado. | Documentacao criada e revisada. |

## Conflicts

| Task | File | Conflict | Resolution |
|---|---|---|---|
