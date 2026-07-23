# Roadmap de Implementacao - FinanceControl BFF

Este roadmap transforma a `spec.md` em tarefas tecnicas pequenas, ordenadas por dependencia. Todas as tarefas iniciam com status `Pending`.

| Task | Nome | Objetivo | Depende de | Complexidade | Estimativa | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | Bootstrap do projeto NestJS | Criar a base NestJS, TypeScript e scripts iniciais | - | Baixa | 2h | Pending |
| 002 | Estrutura de pastas base | Criar a organizacao de diretorios definida na spec | 001 | Baixa | 1h | Pending |
| 003 | ESLint e Prettier | Configurar padronizacao e qualidade de codigo | 001 | Baixa | 1h | Pending |
| 004 | ConfigModule e variaveis de ambiente | Centralizar configuracoes e validar `.env` | 001,002 | Media | 3h | Pending |
| 005 | Bootstrap HTTP global | Configurar prefixo, CORS, ValidationPipe e providers globais iniciais | 004 | Media | 2h | Pending |
| 006 | Docker e PostgreSQL | Criar ambiente local com Docker Compose e PostgreSQL | 004 | Media | 3h | Pending |
| 007 | Prisma schema e migrations iniciais | Modelar entidades persistidas e criar migration inicial | 006 | Alta | 4h | Pending |
| 008 | PrismaModule, PrismaService e seed | Integrar Prisma ao NestJS e criar seed local | 007 | Media | 3h | Pending |
| 009 | Shared e Common base | Criar DTOs, enums, interfaces, constants e utils compartilhados | 005 | Media | 3h | Pending |
| 010 | Exception filters | Padronizar respostas de erro HTTP, Prisma e inesperadas | 008,009 | Media | 3h | Pending |
| 011 | Interceptors e request context | Criar wrapper de resposta, logs de request e request ID | 010 | Media | 3h | Pending |
| 012 | Swagger base | Configurar OpenAPI, Bearer Auth e rota `/docs` | 011 | Baixa | 2h | Pending |
| 013 | UsersModule base | Criar modulo de usuarios, perfil autenticado e repository | 008,012 | Media | 4h | Pending |
| 014 | AuthModule base | Implementar registro, login, JWT e refresh token | 013 | Alta | 5h | Pending |
| 015 | Guards e decorators de autenticacao | Implementar `JwtAuthGuard`, `@CurrentUser()` e `@Public()` | 014 | Media | 3h | Pending |
| 016 | Roles e permissions | Implementar roles, permissions, guards e decorators | 015 | Media | 3h | Pending |
| 017 | CategoriesModule | Criar categorias financeiras padrao e listagem por usuario | 016 | Media | 4h | Pending |
| 018 | TransactionsModule | Criar receitas, despesas, historico e soft delete | 017 | Alta | 5h | Pending |
| 019 | GoalsModule | Criar metas por categoria e periodo | 018 | Media | 4h | Pending |
| 020 | RecurrencesModule CRUD | Criar, listar e excluir recorrencias | 018 | Media | 4h | Pending |
| 021 | Processamento de recorrencias | Processar recorrencias sem duplicidade mensal | 020 | Alta | 4h | Pending |
| 022 | DashboardModule | Criar endpoints agregados de resumo e graficos | 019,021 | Alta | 5h | Pending |
| 023 | ImportExportModule CSV | Implementar importacao e exportacao CSV | 018 | Alta | 4h | Pending |
| 024 | Testes unitarios | Cobrir services, validators, mappers, utils e guards | 016,023 | Media | 5h | Pending |
| 025 | Testes de integracao | Cobrir repositories, PrismaService e fluxos com banco | 023,024 | Alta | 5h | Pending |
| 026 | Testes E2E principais | Cobrir fluxos HTTP usados pelo front-end | 022,023,025 | Alta | 6h | Pending |
| 027 | Swagger completo dos modulos | Revisar documentacao de todos os endpoints e DTOs | 022,023 | Media | 3h | Pending |
| 028 | Hardening de producao | Reforcar seguranca, logs, rate limit e Docker final | 026,027 | Alta | 4h | Pending |
