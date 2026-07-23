# Roadmap de Implementacao - Frontend Integrado ao BFF em Monorepo

Este roadmap divide a integracao descrita em `frontend-integration-spec.md` em tarefas pequenas, autocontidas e ordenadas por dependencia.

Premissa central: o frontend original em `C:\Users\joao\Documents\projetos\FinanceControl\FinanceControlFront` deve permanecer intacto. O frontend integrado sera criado neste repositorio, em `apps/web`, para uso em monorepo durante o desenvolvimento.

| Task | Nome | Objetivo | Depende de | Complexidade | Estimativa | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | Preparacao do monorepo web | Criar `apps/web` copiando o frontend original sem alterar a origem | - | Media | 2h | Pending |
| 002 | Scripts e gitignore do monorepo | Adicionar scripts root para backend/frontend e ignorar artefatos do Angular | 001 | Baixa | 1h | Pending |
| 003 | Configuracao de ambientes Angular | Criar environments com `apiBaseUrl` e ajustar build dev/prod | 001 | Baixa | 1h | Pending |
| 004 | HTTP base e modelos de API | Habilitar HttpClient e criar envelopes `ApiResponse`/`ApiError` | 003 | Media | 2h | Pending |
| 005 | Modelos BFF e ViewModels financeiros | Criar contratos TypeScript do BFF e modelos de UI | 004 | Media | 2h | Pending |
| 006 | TokenStorage e modelos de auth | Implementar armazenamento de tokens e tipos de auth | 004 | Baixa | 2h | Pending |
| 007 | AuthService | Implementar register/login/refresh/logout/users-me contra o BFF | 006 | Media | 3h | Pending |
| 008 | Interceptor JWT e AuthGuard | Injetar Bearer token, renovar sessao e proteger rotas | 007 | Alta | 3h | Pending |
| 009 | Shell de autenticacao | Criar fluxo visual minimo de login/register/logout sem alterar o front antigo | 008 | Media | 3h | Pending |
| 010 | API services financeiros | Criar services Angular para categories, transactions, dashboard, goals, recurrences e CSV | 005,008 | Media | 3h | Pending |
| 011 | Mappers financeiros | Converter DTOs do BFF para ViewModels e requests da UI para DTOs | 005 | Media | 3h | Pending |
| 012 | Store de UI sem localStorage financeiro | Refatorar `FinanceStore` para cache/estado de tela em vez de persistencia financeira | 010,011 | Alta | 4h | Pending |
| 013 | Categorias do BFF nos formularios | Trocar categorias fixas por categorias da API e emitir `categoryId` | 010,011,012 | Alta | 4h | Pending |
| 014 | Transacoes via BFF | Integrar criar receita/despesa, historico e delete por `id` | 010,011,012,013 | Alta | 5h | Pending |
| 015 | Dashboard e graficos via BFF | Substituir calculos locais por `/dashboard/monthly-summary` e `/dashboard/charts` | 010,011,012,014 | Alta | 4h | Pending |
| 016 | Metas via BFF | Integrar `GET /goals` e `PUT /goals` usando `categoryId` | 010,011,012,013,015 | Media | 4h | Pending |
| 017 | Recorrencias via BFF | Integrar CRUD/processamento de recorrencias e remover processamento local | 010,011,012,013,014 | Alta | 4h | Pending |
| 018 | CSV via BFF | Migrar export/import para endpoints multipart/blob do BFF | 010,012,014 | Media | 3h | Pending |
| 019 | Erros, loading e permissões | Padronizar estados de erro/loading e helper de permissions | 008,012,014,015,016,017,018 | Media | 3h | Pending |
| 020 | Testes unitarios do frontend | Cobrir auth, interceptor, mappers, api services e facade | 019 | Alta | 5h | Pending |
| 021 | Validacao integrada local | Rodar backend + frontend, validar fluxo manual e builds | 020 | Media | 3h | Pending |
| 022 | Documentacao operacional | Documentar comandos de monorepo, portas, envs e fluxo local | 021 | Baixa | 1h | Pending |

