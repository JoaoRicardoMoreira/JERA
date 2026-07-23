# Execution Plan - FinanceControl BFF

Este plano coordena a execucao das tasks definidas em `implementation/task-001.md` ate `implementation/task-028.md`, usando `spec.md` como fonte arquitetural. Nenhuma task deve iniciar sem que suas dependencias estejam concluidas e sem verificar arquivos bloqueados em `implementation/agent-status.md`.

## 1. Mapa de dependencias

| Task | Nome | Depende de | Bloqueia | Arquivos envolvidos | Risco de conflito |
| --- | --- | --- | --- | --- | --- |
| 001 | Bootstrap do projeto NestJS | - | 002,003,004 | `package.json`, `package-lock.json`, `nest-cli.json`, `tsconfig*.json`, `src/main.ts`, `src/app.module.ts` | Alto: cria arquivos globais do projeto |
| 002 | Estrutura de pastas base | 001 | 004 | `src/config/**`, `src/database/**`, `src/common/**`, `src/shared/**`, `src/modules/**`, `src/infra/**` | Medio: cria diretorios usados por todas as tasks |
| 003 | ESLint e Prettier | 001 | - | `.eslintrc.js`, `.prettierrc`, `.prettierignore`, `package.json` | Alto: altera `package.json` |
| 004 | ConfigModule e variaveis de ambiente | 001,002 | 005,006 | `.env.example`, `src/config/**`, `src/app.module.ts`, `package.json` | Alto: altera configuracao global e `package.json` |
| 005 | Bootstrap HTTP global | 004 | 009 | `src/main.ts`, `src/config/cors.config.ts`, `src/config/validation.config.ts` | Alto: altera `main.ts` e config global |
| 006 | Docker e PostgreSQL | 004 | 007 | `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example` | Medio: compartilha `.env.example` com config |
| 007 | Prisma schema e migrations iniciais | 006 | 008 | `prisma/schema.prisma`, `prisma/migrations/**`, `package.json` | Alto: altera schema Prisma e `package.json` |
| 008 | PrismaModule, PrismaService e seed | 007 | 010,013 | `src/database/**`, `prisma/seed.ts`, `src/app.module.ts`, `package.json` | Alto: altera banco, `app.module.ts` e scripts |
| 009 | Shared e Common base | 005 | 010 | `src/shared/**`, `src/common/interfaces/**`, `src/common/constants/**`, `src/common/utils/**` | Medio: base transversal |
| 010 | Exception filters | 008,009 | 011 | `src/common/filters/**`, `src/main.ts` | Alto: altera `main.ts` |
| 011 | Interceptors e request context | 010 | 012 | `src/common/interceptors/**`, `src/common/middlewares/**`, `src/main.ts`, `src/app.module.ts` | Alto: altera arquivos globais |
| 012 | Swagger base | 011 | 013 | `src/main.ts`, `src/config/swagger.config.ts`, `package.json` | Alto: altera `main.ts` e `package.json` |
| 013 | UsersModule base | 008,012 | 014 | `src/modules/users/**`, `src/app.module.ts` | Medio: altera modulo raiz |
| 014 | AuthModule base | 013 | 015 | `src/modules/auth/**`, `src/modules/users/**`, `src/app.module.ts`, `package.json` | Alto: toca auth, users e scripts/deps |
| 015 | Guards e decorators de autenticacao | 014 | 016 | `src/common/guards/jwt-auth.guard.ts`, `src/common/decorators/current-user.decorator.ts`, `src/common/decorators/public.decorator.ts`, `src/main.ts`, controllers auth/users | Alto: altera auth global e controllers |
| 016 | Roles e permissions | 015 | 017,024 | `src/common/guards/**`, `src/common/decorators/**`, `src/modules/auth/**`, `src/main.ts` | Alto: autorizacao global |
| 017 | CategoriesModule | 016 | 018 | `src/modules/categories/**`, `src/app.module.ts`, `prisma/seed.ts` | Medio: modulo e seed |
| 018 | TransactionsModule | 017 | 019,020,023 | `src/modules/transactions/**`, `src/app.module.ts` | Medio: modulo financeiro central |
| 019 | GoalsModule | 018 | 022 | `src/modules/goals/**`, `src/app.module.ts` | Medio: modulo financeiro |
| 020 | RecurrencesModule CRUD | 018 | 021 | `src/modules/recurrences/**`, `src/app.module.ts` | Medio: modulo financeiro |
| 021 | Processamento de recorrencias | 020 | 022 | `src/modules/recurrences/**`, `src/modules/transactions/transactions.repository.ts` | Alto: toca dois modulos |
| 022 | DashboardModule | 019,021 | 026,027 | `src/modules/dashboard/**`, `src/app.module.ts` | Medio: modulo agregado BFF |
| 023 | ImportExportModule CSV | 018 | 024,025,026,027 | `src/modules/import-export/**`, `src/modules/transactions/**`, `src/app.module.ts` | Alto: toca import/export e transactions |
| 024 | Testes unitarios | 016,023 | 025 | `src/modules/**/tests/**`, `src/common/guards/tests/**`, `src/common/utils/*.spec.ts`, `package.json` | Medio: testes e scripts |
| 025 | Testes de integracao | 023,024 | 026 | `test/integration/**`, `package.json`, `docker-compose.yml`, `.env.example` | Alto: infraestrutura de teste |
| 026 | Testes E2E principais | 022,023,025 | 028 | `test/**`, `package.json` | Medio: testes finais |
| 027 | Swagger completo dos modulos | 022,023 | 028 | `src/config/swagger.config.ts`, `src/modules/**/**.controller.ts`, `src/modules/**/dto/*.dto.ts` | Alto: toca varios modulos |
| 028 | Hardening de producao | 026,027 | - | `src/main.ts`, `src/config/**`, `src/common/interceptors/logging.interceptor.ts`, `Dockerfile`, `docker-compose.yml`, `.env.example`, `package.json` | Alto: revisao global final |

## 2. Ondas de execucao paralela

### Wave 1

- task-001

Bloqueia: task-002, task-003, task-004.

### Wave 2

- task-002
- task-003

Observacao: podem rodar em paralelo se `task-003` bloquear `package.json` e `task-002` bloquear apenas diretorios. Se `task-002` precisar criar arquivos de placeholder que afetem configuracao, pausar `task-003`.

### Wave 3

- task-004

Bloqueia: task-005 e task-006.

### Wave 4

- task-005
- task-006

Observacao: podem rodar em paralelo somente se `task-006` nao alterar `.env.example` enquanto `task-005` estiver ativo. Caso precise alterar `.env.example`, task-006 deve aguardar task-005.

### Wave 5

- task-007
- task-009

Observacao: task-007 depende de task-006; task-009 depende de task-005. Elas podem rodar em paralelo se task-007 bloquear `prisma/**` e `package.json`, enquanto task-009 fica restrita a `src/shared/**` e `src/common/**`.

### Wave 6

- task-008

Bloqueia: task-010 e task-013.

### Wave 7

- task-010

Bloqueia: task-011.

### Wave 8

- task-011

Bloqueia: task-012.

### Wave 9

- task-012

Bloqueia: task-013.

### Wave 10

- task-013

Bloqueia: task-014.

### Wave 11

- task-014

Bloqueia: task-015.

### Wave 12

- task-015

Bloqueia: task-016.

### Wave 13

- task-016

Bloqueia: task-017 e task-024.

### Wave 14

- task-017

Bloqueia: task-018.

### Wave 15

- task-018

Bloqueia: task-019, task-020 e task-023.

### Wave 16

- task-019
- task-020
- task-023

Observacao: task-023 altera `src/modules/transactions/**`, entao so pode iniciar em paralelo com task-019 e task-020 se nao tocar arquivos bloqueados por elas. Nao ha conflito direto com `goals/**` e `recurrences/**`, mas ha conflito potencial em `src/app.module.ts`; serializar o registro no modulo raiz.

### Wave 17

- task-021

Bloqueia: task-022.

### Wave 18

- task-022
- task-024

Observacao: task-024 depende de task-023 e task-016; task-022 depende de task-019 e task-021. Podem rodar em paralelo se testes nao alterarem arquivos de implementacao bloqueados pelo dashboard.

### Wave 19

- task-025
- task-027

Observacao: task-027 toca controllers e DTOs de varios modulos; evitar paralelo com qualquer implementacao de modulo. Nesta wave, task-025 deve ficar em `test/integration/**`, `package.json`, `docker-compose.yml` e `.env.example`; se precisar alterar DTO/controller, pausar.

### Wave 20

- task-026

Bloqueia: task-028.

### Wave 21

- task-028

Finaliza o roadmap inicial.

## 3. Alocacao de agentes

### Agent: bootstrap-agent

Task: task-001

Responsabilidade: criar base NestJS, TypeScript e scripts iniciais.

Pode alterar:

- `package.json`
- `package-lock.json`
- `nest-cli.json`
- `tsconfig.json`
- `tsconfig.build.json`
- `src/main.ts`
- `src/app.module.ts`

Nao pode alterar:

- `implementation/**`
- `prisma/**`
- `Dockerfile`
- `docker-compose.yml`
- `src/modules/**`

Dependencias: nenhuma.

Criterios de conclusao: projeto base criado e compilavel quando dependencias estiverem instaladas.

### Agent: structure-agent

Task: task-002

Responsabilidade: criar estrutura de pastas base.

Pode alterar:

- `src/config/**`
- `src/database/**`
- `src/common/**`
- `src/shared/**`
- `src/modules/**`
- `src/infra/**`

Nao pode alterar:

- `package.json`
- `src/main.ts`
- `src/app.module.ts`

Dependencias: task-001.

Criterios de conclusao: diretorios da spec existem.

### Agent: lint-format-agent

Task: task-003

Responsabilidade: configurar ESLint e Prettier.

Pode alterar:

- `.eslintrc.js`
- `.prettierrc`
- `.prettierignore`
- `package.json`

Nao pode alterar:

- `src/**`
- `prisma/**`
- `docker-compose.yml`

Dependencias: task-001.

Criterios de conclusao: scripts de lint e format configurados.

### Agent: config-agent

Task: task-004

Responsabilidade: criar configuracoes centralizadas e validacao de ambiente.

Pode alterar:

- `.env.example`
- `src/config/**`
- `src/app.module.ts`
- `package.json`

Nao pode alterar:

- `prisma/**`
- `src/modules/**`
- `Dockerfile`
- `docker-compose.yml`

Dependencias: task-001, task-002.

Criterios de conclusao: ConfigModule global e variaveis obrigatorias validadas.

### Agent: http-bootstrap-agent

Task: task-005

Responsabilidade: configurar prefixo global, CORS e ValidationPipe.

Pode alterar:

- `src/main.ts`
- `src/config/cors.config.ts`
- `src/config/validation.config.ts`

Nao pode alterar:

- `package.json`
- `src/modules/**`
- `prisma/**`

Dependencias: task-004.

Criterios de conclusao: prefixo `/api/v1`, CORS e ValidationPipe ativos.

### Agent: docker-agent

Task: task-006

Responsabilidade: criar Dockerfile, Compose e PostgreSQL local.

Pode alterar:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `.env.example`

Nao pode alterar:

- `src/**`
- `prisma/**`
- `package.json`

Dependencias: task-004.

Criterios de conclusao: Compose define `api`, `postgres`, volume e healthcheck.

### Agent: prisma-schema-agent

Task: task-007

Responsabilidade: criar schema Prisma e migration inicial.

Pode alterar:

- `prisma/schema.prisma`
- `prisma/migrations/**`
- `package.json`

Nao pode alterar:

- `src/modules/**`
- `src/database/**`
- `docker-compose.yml`

Dependencias: task-006.

Criterios de conclusao: modelos e relacionamentos da spec existem no schema.

### Agent: prisma-runtime-agent

Task: task-008

Responsabilidade: integrar Prisma ao NestJS e criar seed.

Pode alterar:

- `src/database/**`
- `prisma/seed.ts`
- `src/app.module.ts`
- `package.json`

Nao pode alterar:

- `prisma/schema.prisma`
- `src/modules/**`

Dependencias: task-007.

Criterios de conclusao: PrismaService injetavel e seed local executavel.

### Agent: shared-common-agent

Task: task-009

Responsabilidade: criar DTOs, enums, interfaces, constants e utils compartilhados.

Pode alterar:

- `src/shared/**`
- `src/common/interfaces/**`
- `src/common/constants/**`
- `src/common/utils/**`

Nao pode alterar:

- `src/main.ts`
- `src/app.module.ts`
- `package.json`
- `src/modules/**`

Dependencias: task-005.

Criterios de conclusao: artefatos compartilhados criados e sem dependencia circular.

### Agent: filters-agent

Task: task-010

Responsabilidade: criar filtros globais de erro.

Pode alterar:

- `src/common/filters/**`
- `src/main.ts`

Nao pode alterar:

- `src/modules/**`
- `package.json`
- `prisma/**`

Dependencias: task-008, task-009.

Criterios de conclusao: erros seguem padrao da spec.

### Agent: interceptors-agent

Task: task-011

Responsabilidade: criar response/logging/serialization interceptors e request context.

Pode alterar:

- `src/common/interceptors/**`
- `src/common/middlewares/**`
- `src/main.ts`
- `src/app.module.ts`

Nao pode alterar:

- `src/modules/**`
- `prisma/**`
- `package.json`

Dependencias: task-010.

Criterios de conclusao: wrapper de resposta e logs de request ativos.

### Agent: swagger-agent

Task: task-012

Responsabilidade: configurar Swagger base.

Pode alterar:

- `src/main.ts`
- `src/config/swagger.config.ts`
- `package.json`

Nao pode alterar:

- `src/modules/**`
- `prisma/**`

Dependencias: task-011.

Criterios de conclusao: `/docs` habilitado por configuracao e Bearer Auth documentado.

### Agent: users-agent

Task: task-013

Responsabilidade: criar UsersModule base.

Pode alterar:

- `src/modules/users/**`
- `src/app.module.ts`

Nao pode alterar:

- `src/modules/auth/**`
- `prisma/**`
- `package.json`

Dependencias: task-008, task-012.

Criterios de conclusao: `/users/me` preparado e usuario nao expoe dados sensiveis.

### Agent: auth-agent

Task: task-014

Responsabilidade: implementar AuthModule base.

Pode alterar:

- `src/modules/auth/**`
- `src/modules/users/**`
- `src/app.module.ts`
- `package.json`

Nao pode alterar:

- `prisma/schema.prisma`
- `src/modules/transactions/**`

Dependencias: task-013.

Criterios de conclusao: registro, login, refresh e logout implementados.

### Agent: jwt-guard-agent

Task: task-015

Responsabilidade: implementar guard JWT e decorators de autenticacao.

Pode alterar:

- `src/common/guards/jwt-auth.guard.ts`
- `src/common/decorators/current-user.decorator.ts`
- `src/common/decorators/public.decorator.ts`
- `src/main.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/users/users.controller.ts`
- `src/common/interfaces/request-user.interface.ts`

Nao pode alterar:

- `prisma/**`
- `src/modules/transactions/**`

Dependencias: task-014.

Criterios de conclusao: rotas protegidas exigem JWT e publicas continuam livres.

### Agent: authorization-agent

Task: task-016

Responsabilidade: implementar roles e permissions.

Pode alterar:

- `src/common/guards/**`
- `src/common/decorators/**`
- `src/modules/auth/**`
- `src/main.ts`

Nao pode alterar:

- `src/modules/categories/**`
- `src/modules/transactions/**`
- `prisma/**`

Dependencias: task-015.

Criterios de conclusao: guards e decorators de autorizacao funcionam.

### Agent: categories-agent

Task: task-017

Responsabilidade: criar CategoriesModule.

Pode alterar:

- `src/modules/categories/**`
- `src/app.module.ts`
- `prisma/seed.ts`

Nao pode alterar:

- `src/modules/transactions/**`
- `prisma/schema.prisma`
- `package.json`

Dependencias: task-016.

Criterios de conclusao: categorias do usuario listadas e soft delete respeitado.

### Agent: transactions-agent

Task: task-018

Responsabilidade: criar TransactionsModule.

Pode alterar:

- `src/modules/transactions/**`
- `src/app.module.ts`

Nao pode alterar:

- `src/modules/goals/**`
- `src/modules/recurrences/**`
- `src/modules/import-export/**`
- `prisma/schema.prisma`

Dependencias: task-017.

Criterios de conclusao: receitas, despesas, historico e soft delete implementados.

### Agent: goals-agent

Task: task-019

Responsabilidade: criar GoalsModule.

Pode alterar:

- `src/modules/goals/**`
- `src/app.module.ts`

Nao pode alterar:

- `src/modules/transactions/**`
- `src/modules/recurrences/**`
- `prisma/**`

Dependencias: task-018.

Criterios de conclusao: metas por categoria e periodo implementadas.

### Agent: recurrences-agent

Task: task-020

Responsabilidade: criar RecurrencesModule CRUD.

Pode alterar:

- `src/modules/recurrences/**`
- `src/app.module.ts`

Nao pode alterar:

- `src/modules/transactions/**`
- `src/modules/goals/**`
- `prisma/**`

Dependencias: task-018.

Criterios de conclusao: criar, listar e excluir recorrencias.

### Agent: recurrence-processing-agent

Task: task-021

Responsabilidade: processar recorrencias sem duplicidade mensal.

Pode alterar:

- `src/modules/recurrences/**`
- `src/modules/transactions/transactions.repository.ts`

Nao pode alterar:

- `src/modules/goals/**`
- `src/modules/dashboard/**`
- `prisma/schema.prisma`

Dependencias: task-020.

Criterios de conclusao: processamento nao duplica transacoes no mesmo periodo.

### Agent: dashboard-agent

Task: task-022

Responsabilidade: criar DashboardModule.

Pode alterar:

- `src/modules/dashboard/**`
- `src/app.module.ts`

Nao pode alterar:

- `src/modules/transactions/**`
- `src/modules/goals/**`
- `src/modules/recurrences/**`

Dependencias: task-019, task-021.

Criterios de conclusao: resumo mensal e dados de graficos retornam payload BFF.

### Agent: csv-agent

Task: task-023

Responsabilidade: criar ImportExportModule CSV.

Pode alterar:

- `src/modules/import-export/**`
- `src/modules/transactions/transactions.service.ts`
- `src/modules/transactions/transactions.repository.ts`
- `src/app.module.ts`

Nao pode alterar:

- `src/modules/goals/**`
- `src/modules/recurrences/**`
- `prisma/schema.prisma`

Dependencias: task-018.

Criterios de conclusao: importacao e exportacao CSV funcionam por usuario.

### Agent: unit-tests-agent

Task: task-024

Responsabilidade: consolidar testes unitarios.

Pode alterar:

- `src/modules/**/tests/**`
- `src/common/guards/tests/**`
- `src/common/utils/*.spec.ts`
- `package.json`

Nao pode alterar:

- Implementacoes em `src/modules/**` fora de `tests`
- `prisma/**`

Dependencias: task-016, task-023.

Criterios de conclusao: suite unitaria passa.

### Agent: integration-tests-agent

Task: task-025

Responsabilidade: criar testes de integracao.

Pode alterar:

- `test/integration/**`
- `package.json`
- `docker-compose.yml`
- `.env.example`

Nao pode alterar:

- `src/modules/**`
- `prisma/schema.prisma`

Dependencias: task-023, task-024.

Criterios de conclusao: repositories e PrismaService testados com banco de teste.

### Agent: e2e-tests-agent

Task: task-026

Responsabilidade: criar testes E2E principais.

Pode alterar:

- `test/**`
- `package.json`

Nao pode alterar:

- `src/modules/**`
- `prisma/**`

Dependencias: task-022, task-023, task-025.

Criterios de conclusao: fluxos HTTP principais cobertos com Supertest.

### Agent: swagger-complete-agent

Task: task-027

Responsabilidade: completar documentacao Swagger dos modulos.

Pode alterar:

- `src/config/swagger.config.ts`
- `src/modules/**/**.controller.ts`
- `src/modules/**/dto/*.dto.ts`

Nao pode alterar:

- Repositories
- Services
- `prisma/**`

Dependencias: task-022, task-023.

Criterios de conclusao: endpoints e DTOs documentados com exemplos.

### Agent: production-hardening-agent

Task: task-028

Responsabilidade: hardening final de producao.

Pode alterar:

- `src/main.ts`
- `src/config/**`
- `src/common/interceptors/logging.interceptor.ts`
- `Dockerfile`
- `docker-compose.yml`
- `.env.example`
- `package.json`

Nao pode alterar:

- Regras de negocio dos modulos
- `prisma/schema.prisma`

Dependencias: task-026, task-027.

Criterios de conclusao: Helmet, rate limit, logs seguros, Docker otimizado e testes passando.
