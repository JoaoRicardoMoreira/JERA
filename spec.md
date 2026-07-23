# Especificação Técnica - FinanceControl BFF

## 1. Visão Geral

### Objetivo do projeto

O objetivo deste projeto é criar um Backend for Frontend (BFF) para o front-end FinanceControl, que já está desenvolvido e será o único consumidor direto desta API.

O BFF será responsável por centralizar autenticação, autorização, validação de dados, persistência, regras de negócio necessárias à interface e adaptação de respostas para o formato mais adequado ao front-end.

Este backend não deve ser tratado como um CRUD genérico. Ele deve expor endpoints orientados aos fluxos da interface, reduzindo complexidade no front-end e mantendo as regras de domínio no servidor.

### Escopo

O backend deverá atender inicialmente aos seguintes domínios funcionais:

- Autenticação e gerenciamento de sessão.
- Usuários e perfil autenticado.
- Registro de receitas.
- Registro de despesas.
- Categorias financeiras.
- Metas por categoria.
- Transações recorrentes.
- Resumos financeiros mensais e anuais.
- Dados agregados para gráficos.
- Importação e exportação de dados.
- Auditoria mínima por timestamps.

Funcionalidades externas poderão ser integradas futuramente, mas sempre por meio de services especializados dentro da camada de infraestrutura ou de módulos próprios.

### Arquitetura

A arquitetura será baseada em NestJS modular, aplicando princípios SOLID e Clean Architecture quando fizer sentido para manter separação clara entre entrada HTTP, regras de aplicação, domínio e infraestrutura.

O projeto será organizado em módulos funcionais. Cada módulo terá controller, service, repository, DTOs, entidades de domínio, interfaces, mappers, validators e testes. O Prisma será utilizado como ORM e camada de acesso ao PostgreSQL.

### Tecnologias utilizadas

- Node.js como runtime.
- NestJS como framework backend.
- TypeScript como linguagem principal.
- PostgreSQL como banco relacional.
- Prisma ORM para modelagem, migrations e queries.
- Docker e Docker Compose para ambiente local e infraestrutura.
- JWT para autenticação stateless.
- Refresh Token para renovação segura de sessão.
- Swagger/OpenAPI para documentação da API.
- class-validator para validação declarativa.
- class-transformer para transformação e serialização de DTOs.
- ESLint e Prettier para qualidade e padronização.
- Jest para testes unitários e de integração.
- Supertest para testes E2E.

### Convenções gerais

- A API deve ser versionada com prefixo `/api/v1`.
- Todas as respostas devem seguir padrão consistente.
- Todos os endpoints protegidos devem exigir JWT.
- Regras de negócio devem ficar em services ou domain services, nunca em controllers.
- Controllers devem ser finos e apenas orquestrar entrada e saída HTTP.
- Repositories devem encapsular acesso ao Prisma.
- DTOs devem validar entrada externa.
- Entidades de domínio não devem depender do Prisma.
- O front-end não deve conhecer detalhes internos do banco.
- Nomes de arquivos devem usar kebab-case.
- Classes, interfaces e enums devem usar PascalCase.
- Variáveis, métodos e propriedades devem usar camelCase.

---

## 2. Estrutura de Pastas

Estrutura base proposta:

```text
src/
  main.ts
  app.module.ts

  config/
    app.config.ts
    database.config.ts
    jwt.config.ts
    cors.config.ts
    swagger.config.ts
    validation.config.ts
    env.validation.ts

  database/
    prisma.module.ts
    prisma.service.ts
    prisma.middleware.ts

  common/
    decorators/
      current-user.decorator.ts
      public.decorator.ts
      roles.decorator.ts
      permissions.decorator.ts

    filters/
      http-exception.filter.ts
      prisma-exception.filter.ts
      unexpected-exception.filter.ts

    guards/
      jwt-auth.guard.ts
      roles.guard.ts
      permissions.guard.ts

    interceptors/
      response.interceptor.ts
      logging.interceptor.ts
      serialization.interceptor.ts

    middlewares/
      request-context.middleware.ts

    pipes/
      parse-uuid.pipe.ts

    utils/
      date.util.ts
      crypto.util.ts
      pagination.util.ts
      currency.util.ts

    constants/
      error-codes.ts
      app.constants.ts

    interfaces/
      api-response.interface.ts
      pagination.interface.ts
      request-user.interface.ts

  shared/
    dto/
      pagination-query.dto.ts
      date-range-query.dto.ts

    types/
      nullable.type.ts
      id.type.ts

    enums/
      environment.enum.ts
      sort-direction.enum.ts

  modules/
    auth/
      auth.module.ts
      auth.controller.ts
      auth.service.ts
      auth.repository.ts
      dto/
      entities/
      interfaces/
      mapper/
      validators/
      tests/

    users/
      users.module.ts
      users.controller.ts
      users.service.ts
      users.repository.ts
      dto/
      entities/
      interfaces/
      mapper/
      validators/
      tests/

    transactions/
      transactions.module.ts
      transactions.controller.ts
      transactions.service.ts
      transactions.repository.ts
      dto/
      entities/
      interfaces/
      mapper/
      validators/
      tests/

    categories/
      categories.module.ts
      categories.controller.ts
      categories.service.ts
      categories.repository.ts
      dto/
      entities/
      interfaces/
      mapper/
      validators/
      tests/

    goals/
      goals.module.ts
      goals.controller.ts
      goals.service.ts
      goals.repository.ts
      dto/
      entities/
      interfaces/
      mapper/
      validators/
      tests/

    recurrences/
      recurrences.module.ts
      recurrences.controller.ts
      recurrences.service.ts
      recurrences.repository.ts
      dto/
      entities/
      interfaces/
      mapper/
      validators/
      tests/

    dashboard/
      dashboard.module.ts
      dashboard.controller.ts
      dashboard.service.ts
      dashboard.repository.ts
      dto/
      entities/
      interfaces/
      mapper/
      validators/
      tests/

    import-export/
      import-export.module.ts
      import-export.controller.ts
      import-export.service.ts
      dto/
      interfaces/
      mapper/
      validators/
      tests/

  infra/
    external-services/
      external-service-client.interface.ts
    http/
      http-client.module.ts
      http-client.service.ts
    storage/
      storage.interface.ts
    queue/
      queue.interface.ts
```

### Responsabilidades

- `main.ts`: bootstrap da aplicação, configuração global de pipes, filtros, interceptors, CORS, Swagger e prefixo global.
- `app.module.ts`: módulo raiz, responsável por importar módulos globais e módulos de negócio.
- `config/`: centraliza leitura e validação de configurações por ambiente.
- `database/`: encapsula Prisma, conexão com banco, middlewares e lifecycle hooks.
- `common/`: código transversal usado por toda a aplicação, como guards, filters, decorators, interceptors e utilitários.
- `shared/`: DTOs, enums e tipos genéricos compartilhados sem dependência de infraestrutura.
- `modules/`: módulos funcionais do domínio BFF.
- `infra/`: integrações externas e implementações técnicas que não pertencem diretamente ao domínio.

---

## 3. Arquitetura

### Backend for Frontend

O BFF existe para atender especificamente o front-end FinanceControl. Ele deve expor endpoints desenhados para telas e fluxos da interface, não para representar diretamente tabelas do banco.

Exemplo: a tela inicial precisa de saldo, receitas, gastos, metas e dados de gráficos. Em vez de exigir várias chamadas do front-end, o BFF pode expor um endpoint como `GET /dashboard/monthly-summary`, retornando o payload já agregado e pronto para renderização.

Decisão arquitetural: o BFF reduz acoplamento entre front-end e persistência. Isso permite alterar banco, integrações ou regras internas sem forçar mudanças grandes na interface.

### Modularização do NestJS

Cada domínio funcional será isolado em um módulo NestJS. Módulos devem importar apenas dependências necessárias e expor providers somente quando outro módulo precisar usá-los.

Módulos principais:

- `AuthModule`
- `UsersModule`
- `TransactionsModule`
- `CategoriesModule`
- `GoalsModule`
- `RecurrencesModule`
- `DashboardModule`
- `ImportExportModule`

### Dependency Injection

Todas as dependências devem ser injetadas pelo container do NestJS. Controllers não devem instanciar services manualmente. Services não devem instanciar repositories manualmente.

Quando houver uma interface importante, deve-se usar provider token explícito, por exemplo `TRANSACTIONS_REPOSITORY`. Isso facilita testes e troca de implementação.

### Repository Pattern

Repositories encapsulam operações de persistência e consultas Prisma. Eles não devem conter regras de negócio de alto nível.

Responsabilidades do repository:

- Criar, consultar, atualizar e remover registros.
- Aplicar filtros de banco.
- Montar queries Prisma.
- Traduzir dados persistidos para estruturas consumidas pelo service.

### Service Layer

Services contêm casos de uso da aplicação e regras específicas do BFF.

Responsabilidades do service:

- Validar regras de negócio.
- Coordenar repositories.
- Coordenar outros services quando necessário.
- Garantir isolamento por usuário.
- Montar respostas orientadas ao front-end.
- Lançar exceptions de aplicação.

### Controller Layer

Controllers expõem endpoints HTTP e devem ser finos.

Responsabilidades do controller:

- Declarar rotas.
- Aplicar guards e decorators.
- Receber DTOs.
- Chamar services.
- Retornar responses.
- Documentar endpoints com Swagger.

Controllers não devem acessar Prisma, repositories ou regras de negócio diretamente.

### DTO Layer

DTOs validam e documentam entrada e saída da API.

Tipos de DTOs:

- `CreateXDto`
- `UpdateXDto`
- `XResponseDto`
- `XQueryDto`
- `XParamsDto`

DTOs de entrada devem usar `class-validator`. DTOs de resposta devem usar `class-transformer` quando houver necessidade de serialização, ocultação ou transformação de campos.

### Domain Layer

A domain layer representa conceitos de negócio sem dependência de NestJS, Prisma ou HTTP.

No projeto, a domain layer será pragmática: cada módulo terá `entities/`, `interfaces/`, `validators/` e, quando necessário, domain services.

Entidades de domínio devem ser usadas quando houver comportamento relevante. Para estruturas simples sem comportamento, DTOs e types podem ser suficientes.

### Infra Layer

A infra layer contém detalhes técnicos como banco, clientes HTTP, storage, filas e integrações externas.

Decisão arquitetural: separar infraestrutura evita que regras de negócio dependam diretamente de bibliotecas externas.

### Shared Layer

A shared layer contém elementos reutilizáveis, mas sem regra de negócio específica.

Exemplos:

- Paginação.
- Date range.
- Enums genéricos.
- Tipos auxiliares.
- Interfaces de resposta padrão.

### Fluxo completo de uma requisição

1. Cliente chama endpoint HTTP com headers, query, params e body.
2. Middleware cria contexto básico da requisição.
3. Guards verificam autenticação, roles e permissions.
4. Pipes validam e transformam entrada.
5. Controller recebe DTO validado.
6. Controller chama service do caso de uso.
7. Service aplica regras de negócio.
8. Service chama repository ou integrações necessárias.
9. Repository executa queries Prisma.
10. Prisma acessa PostgreSQL.
11. Dados retornam ao service.
12. Service monta payload específico do BFF.
13. Controller retorna resposta.
14. Interceptor padroniza resposta e logs.
15. Exception filters tratam qualquer erro lançado no fluxo.

---

## 4. Organização por Módulos

Cada novo módulo deve seguir a estrutura:

```text
module-name/
  module-name.module.ts
  module-name.controller.ts
  module-name.service.ts
  module-name.repository.ts

  dto/
    create-resource.dto.ts
    update-resource.dto.ts
    resource-response.dto.ts
    resource-query.dto.ts

  entities/
    resource.entity.ts

  interfaces/
    resource-repository.interface.ts
    resource-service.interface.ts

  mapper/
    resource.mapper.ts

  validators/
    resource.validator.ts

  tests/
    module-name.service.spec.ts
    module-name.controller.spec.ts
    module-name.repository.spec.ts
```

### Responsabilidade de cada arquivo

- `*.module.ts`: registra controllers, providers, imports e exports.
- `*.controller.ts`: define endpoints e documentação Swagger.
- `*.service.ts`: implementa casos de uso e regras de negócio.
- `*.repository.ts`: encapsula Prisma e persistência.
- `dto/`: contratos de entrada e saída da API.
- `entities/`: entidades e objetos de domínio.
- `interfaces/`: contratos de repositories, services e integrações.
- `mapper/`: conversão entre Prisma model, entidade e DTO.
- `validators/`: validações específicas que não cabem em decorators simples.
- `tests/`: testes unitários e integração do módulo.

### Regra para criação de módulos

Um novo módulo só deve ser criado quando houver uma fronteira clara de domínio ou responsabilidade. Evitar módulos artificiais que apenas fragmentem código sem benefício.

---

## 5. Banco de Dados

### Organização do Prisma

O Prisma ficará na raiz do projeto:

```text
prisma/
  schema.prisma
  migrations/
  seed.ts
```

O `schema.prisma` será a fonte oficial da modelagem persistida.

### Entidades iniciais previstas

Modelos esperados:

- `User`
- `RefreshToken`
- `Category`
- `Transaction`
- `Goal`
- `Recurrence`

### Relacionamentos

- Um `User` possui muitas `Transaction`.
- Um `User` possui muitas `Category`.
- Um `User` possui muitas `Goal`.
- Um `User` possui muitas `Recurrence`.
- Uma `Category` pode possuir muitas `Transaction`.
- Uma `Category` pode possuir uma ou muitas `Goal`, dependendo da estratégia mensal.
- Uma `Category` pode possuir muitas `Recurrence`.
- Um `RefreshToken` pertence a um `User`.

Todas as consultas funcionais devem filtrar por `userId`, garantindo isolamento de dados entre usuários.

### Migrations

Migrations devem ser criadas com Prisma Migrate. Toda alteração estrutural no banco deve gerar uma migration versionada.

Regras:

- Nunca editar migrations antigas depois de compartilhadas.
- Nomear migrations de forma descritiva.
- Rodar migrations no startup apenas em ambiente local quando configurado.
- Em produção, migrations devem ser aplicadas por pipeline ou comando controlado.

### Seeds

Seeds devem criar dados mínimos para desenvolvimento:

- Usuário de teste opcional.
- Categorias padrão.
- Metas padrão zeradas ou configuráveis.

Seeds não devem rodar automaticamente em produção.

### Convenções de nomenclatura

- Tabelas no banco: snake_case.
- Campos no banco: snake_case.
- Models Prisma: PascalCase.
- Campos Prisma: camelCase com `@map` quando necessário.
- IDs: UUID.
- Datas: `DateTime`.
- Valores monetários: `Decimal`, não `Float`.

Justificativa: valores financeiros precisam de precisão decimal. `Float` pode gerar erros de arredondamento.

### Soft delete

Será utilizada estratégia de soft delete para entidades principais de usuário:

- `Transaction`
- `Category`
- `Goal`
- `Recurrence`
- `RefreshToken`

Campo padrão:

- `deletedAt DateTime?`

Consultas padrão devem ignorar registros com `deletedAt` preenchido.

### Auditoria

Todos os modelos principais devem possuir:

- `createdAt`
- `updatedAt`
- `deletedAt`

Quando fizer sentido, também usar:

- `createdBy`
- `updatedBy`

No escopo inicial, `userId` já cobre autoria funcional dos dados financeiros.

---

## 6. Padrões de Código

### Nomenclatura

- Arquivos: kebab-case.
- Classes: PascalCase.
- Interfaces: PascalCase com nome sem prefixo `I`, exceto quando a equipe decidir explicitamente o contrário.
- Enums: PascalCase.
- Métodos: camelCase.
- Constantes globais: SCREAMING_SNAKE_CASE.

### Imports

- Usar imports absolutos ou paths configurados quando o projeto definir aliases.
- Evitar caminhos relativos profundos.
- Ordenar imports por origem: Node, bibliotecas externas, módulos internos.
- Remover imports não utilizados.

### DTOs

- DTOs de entrada devem ser classes.
- DTOs devem usar decorators do `class-validator`.
- Campos opcionais devem usar `@IsOptional`.
- Campos monetários devem validar número decimal positivo.
- Datas devem validar ISO 8601 ou formato definido pela API.
- DTOs de update devem permitir atualização parcial usando utilitários do NestJS quando adequado.

### Services

- Services devem representar casos de uso.
- Métodos públicos devem ter nomes orientados a ação.
- Services não devem expor detalhes do Prisma.
- Services devem lançar exceptions do NestJS ou exceptions customizadas mapeadas.
- Services devem ser fáceis de testar com mocks de repositories.

### Controllers

- Controllers devem ser pequenos.
- Não devem conter regra de negócio.
- Devem declarar Swagger decorators.
- Devem usar DTOs em body, params e query.
- Devem usar guards explicitamente quando o endpoint for protegido.

### Interfaces

Interfaces devem representar contratos reais. Evitar criar interfaces sem necessidade.

Usar interfaces para:

- Repositories.
- Payloads internos complexos.
- Clientes externos.
- Respostas agregadas do BFF.

### Enums

Enums devem ser usados para valores fechados:

- Tipo de transação: `INCOME`, `EXPENSE`.
- Role de usuário.
- Permission.
- Ambiente.
- Status de recorrência.

Enums expostos na API devem ser documentados no Swagger.

### Exceptions

Usar exceptions específicas:

- `BadRequestException` para entrada inválida semântica.
- `UnauthorizedException` para autenticação ausente ou inválida.
- `ForbiddenException` para usuário autenticado sem permissão.
- `NotFoundException` para recurso inexistente no escopo do usuário.
- `ConflictException` para duplicidades.
- `UnprocessableEntityException` para regras de negócio violadas.

### Async/Await

- Usar `async/await` como padrão para operações assíncronas.
- Evitar misturar `.then()` e `await`.
- Sempre aguardar promises de escrita.
- Não engolir erros silenciosamente.

### Tratamento de erros

- Não retornar erros crus do Prisma.
- Não expor stack trace em produção.
- Usar filtros globais para padronizar erros.
- Erros devem conter `statusCode`, `message`, `error`, `code`, `path` e `timestamp`.

---

## 7. Autenticação

### JWT

O backend usará JWT access tokens para autenticação stateless.

O access token deve conter payload mínimo:

- `sub`: ID do usuário.
- `email`: email do usuário.
- `roles`: roles do usuário.
- `permissions`: permissions efetivas.

Tempo de vida sugerido:

- Access token: 15 minutos.
- Refresh token: 7 a 30 dias, conforme configuração.

### Refresh Token

Refresh tokens devem ser persistidos de forma segura.

Regras:

- Salvar hash do refresh token, nunca o token puro.
- Associar token ao usuário.
- Permitir revogação no logout.
- Permitir rotação de refresh token.
- Registrar expiração.
- Invalidar tokens comprometidos quando houver inconsistência.

### Guards

Guards previstos:

- `JwtAuthGuard`: valida access token.
- `RolesGuard`: valida roles exigidas.
- `PermissionsGuard`: valida permissions exigidas.

### Roles

Roles iniciais:

- `USER`: usuário comum da aplicação.
- `ADMIN`: administração futura.

O escopo inicial pode usar apenas `USER`, mas a arquitetura deve permitir expansão.

### Permissions

Permissions representam ações específicas, por exemplo:

- `transactions:read`
- `transactions:create`
- `transactions:update`
- `transactions:delete`
- `goals:manage`
- `recurrences:manage`
- `dashboard:read`

### Decorators customizados

Decorators previstos:

- `@CurrentUser()`: injeta usuário autenticado.
- `@Public()`: marca rota pública.
- `@Roles(...roles)`: define roles exigidas.
- `@Permissions(...permissions)`: define permissions exigidas.

---

## 8. Tratamento de Erros

### Exception Filters

Filtros globais:

- `HttpExceptionFilter`: padroniza exceptions conhecidas do NestJS.
- `PrismaExceptionFilter`: traduz erros Prisma em HTTP adequado.
- `UnexpectedExceptionFilter`: trata erros inesperados.

### Error Response Pattern

Formato padrão:

```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Dados inválidos.",
  "code": "VALIDATION_ERROR",
  "details": [],
  "path": "/api/v1/transactions",
  "timestamp": "2026-07-02T00:00:00.000Z"
}
```

### HTTP Status

- `200 OK`: consulta ou atualização bem-sucedida.
- `201 Created`: criação bem-sucedida.
- `204 No Content`: remoção bem-sucedida sem corpo.
- `400 Bad Request`: erro de validação ou formato.
- `401 Unauthorized`: token ausente ou inválido.
- `403 Forbidden`: sem permissão.
- `404 Not Found`: recurso não encontrado.
- `409 Conflict`: conflito de unicidade ou estado.
- `422 Unprocessable Entity`: regra de negócio violada.
- `429 Too Many Requests`: rate limit.
- `500 Internal Server Error`: falha inesperada.

### Logs

Todo erro inesperado deve ser logado com:

- Request ID.
- Método HTTP.
- Path.
- User ID, quando houver.
- Stack trace em ambiente não produtivo ou em destino seguro.

---

## 9. Validações

### class-validator

Todos os DTOs de entrada devem usar `class-validator`.

Decorators comuns:

- `@IsString`
- `@IsEmail`
- `@IsUUID`
- `@IsEnum`
- `@IsDateString`
- `@IsNumber`
- `@IsPositive`
- `@Min`
- `@Max`
- `@Length`
- `@IsOptional`

### Pipes

Será configurado `ValidationPipe` global.

Configuração esperada:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`
- `transformOptions.enableImplicitConversion: false`

Justificativa: impedir campos inesperados reduz risco de overposting e torna contratos mais explícitos.

### DTO Validation

Validações de DTO devem cobrir:

- Campos obrigatórios.
- Tipos.
- Limites numéricos.
- Datas.
- Enums.
- Formatos de email e senha.
- Valores monetários.

Validações que dependem do banco ou de regras complexas devem ficar no service ou em validators específicos.

---

## 10. Segurança

### CORS

CORS deve permitir somente origens configuradas por ambiente.

No desenvolvimento:

- `http://localhost:4200`

Em produção:

- Domínio real do front-end.

Nunca usar wildcard em produção.

### Helmet

Usar Helmet para headers básicos de segurança.

### Rate Limit

Aplicar rate limit global e regras mais restritivas para endpoints sensíveis:

- Login.
- Refresh token.
- Recuperação de senha futura.
- Importação de dados.

### SQL Injection

Prisma reduz risco de SQL injection por usar query builder seguro. Ainda assim:

- Evitar raw queries.
- Quando raw query for inevitável, usar parâmetros.
- Nunca concatenar entrada do usuário em SQL.

### XSS

A API deve retornar dados como JSON e não renderizar HTML. Mesmo assim:

- Validar strings.
- Limitar tamanho de campos textuais.
- Sanitizar campos livres quando necessário.
- Não armazenar HTML arbitrário.

### Sanitização

Campos como descrição de transação devem:

- Remover espaços excessivos.
- Limitar tamanho.
- Rejeitar payloads malformados.
- Não aceitar tags HTML quando não houver necessidade.

### Environment Variables

Configurações sensíveis devem vir de variáveis de ambiente:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `BCRYPT_SALT_ROUNDS`
- `CORS_ORIGINS`

### Secrets

Secrets nunca devem ser versionados.

Arquivos `.env` reais devem ficar fora do Git. O projeto deve versionar apenas `.env.example`.

---

## 11. Logging

### Estratégia

Usar `Logger` do NestJS como base inicial. A arquitetura deve permitir substituição futura por Pino, Winston ou integração com ferramenta externa.

### Logs de aplicação

Registrar eventos relevantes:

- Inicialização da aplicação.
- Conexão com banco.
- Execução de migrations em ambiente local, se aplicável.
- Operações sensíveis como login e logout.

### Logs de erro

Erros devem incluir contexto suficiente para investigação sem expor dados sensíveis.

Não logar:

- Senhas.
- Tokens.
- Refresh tokens.
- Dados financeiros completos em produção.

### Logs de requisição

Usar interceptor ou middleware para registrar:

- Request ID.
- Método.
- Path.
- Status code.
- Tempo de resposta.
- User ID, quando autenticado.

---

## 12. Configurações

### ConfigModule

Usar `ConfigModule` global para carregar e validar variáveis de ambiente.

Configurações devem ser agrupadas por domínio:

- `app.config.ts`
- `database.config.ts`
- `jwt.config.ts`
- `cors.config.ts`
- `swagger.config.ts`

### Variáveis de ambiente

`.env.example` deve conter:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

DATABASE_URL=postgresql://finance_user:finance_password@localhost:5432/finance_control?schema=public

JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12
CORS_ORIGINS=http://localhost:4200

RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

SWAGGER_ENABLED=true
SWAGGER_PATH=/docs
```

### Ambientes

#### Development

- Swagger habilitado.
- Logs verbosos.
- CORS para localhost.
- Banco via Docker Compose.

#### Test

- Banco separado.
- Seeds controladas.
- Logs reduzidos.
- JWT secrets próprios de teste.

#### Production

- Swagger opcional ou protegido.
- Logs sem dados sensíveis.
- CORS restrito.
- Secrets gerenciados por ambiente seguro.
- Migrations executadas de forma controlada.

---

## 13. Docker

### Dockerfile

O Dockerfile deve usar build multi-stage:

- Stage de dependências.
- Stage de build.
- Stage final enxuto para runtime.

Decisões:

- Usar imagem Node LTS.
- Instalar apenas dependências de produção no runtime.
- Rodar aplicação como usuário não-root quando possível.

### docker-compose

Serviços previstos:

- `api`: aplicação NestJS.
- `postgres`: banco PostgreSQL.

### PostgreSQL

Configuração local:

- Porta: `5432`.
- Database: `finance_control`.
- User: `finance_user`.
- Password: definido no `.env`.

### Variáveis

O Compose deve carregar variáveis de `.env`.

### Volumes

Usar volume nomeado para dados do PostgreSQL:

- `postgres_data`

### Healthcheck

O serviço PostgreSQL deve possuir healthcheck com `pg_isready`.

A API deve depender do banco saudável antes de subir, quando possível.

---

## 14. Testes

### Unitários

Ferramenta: Jest.

Cobrir:

- Services.
- Validators.
- Mappers.
- Utils.
- Guards.

Repositories devem ser mockados em testes de service.

### Integração

Cobrir:

- Repositories com banco de teste.
- Prisma service.
- Fluxos que dependem de transação no banco.

Usar banco separado para testes, preferencialmente via Docker.

### E2E

Ferramentas:

- Jest.
- Supertest.

Cobrir fluxos reais:

- Registro/login.
- Refresh token.
- Criar despesa.
- Criar receita.
- Consultar dashboard.
- Criar meta.
- Criar recorrência.
- Excluir recurso com isolamento por usuário.

### Critérios mínimos

Antes de concluir uma etapa:

- Build TypeScript deve passar.
- Lint deve passar.
- Testes relacionados à etapa devem passar.
- Swagger deve refletir endpoints novos.

---

## 15. Documentação

### Swagger

Swagger deve ser configurado em `/docs`, quando habilitado.

Deve documentar:

- Autenticação Bearer.
- Tags por módulo.
- DTOs de request.
- DTOs de response.
- Códigos HTTP.
- Exemplos de request e response.

### Padronização dos endpoints

Prefixo global:

- `/api/v1`

Padrões:

- Endpoints de auth: `/auth/*`
- Usuário atual: `/users/me`
- Transações: `/transactions/*`
- Categorias: `/categories/*`
- Metas: `/goals/*`
- Recorrências: `/recurrences/*`
- Dashboard: `/dashboard/*`
- Import/export: `/import-export/*`

### Exemplos de endpoints orientados ao BFF

- `GET /dashboard/monthly-summary?month=7&year=2026`
- `GET /dashboard/charts?month=7&year=2026`
- `GET /transactions/history?month=7&year=2026&type=EXPENSE`
- `POST /transactions/expense`
- `POST /transactions/income`
- `POST /recurrences`
- `POST /import-export/csv/import`
- `GET /import-export/csv/export`

### Exemplo de response padrão

```json
{
  "success": true,
  "data": {
    "balance": 2500,
    "totalIncome": 7000,
    "totalExpense": 4500
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## 16. Fluxo de Desenvolvimento

Toda nova funcionalidade deve seguir este fluxo:

1. Criar ou identificar módulo responsável.
2. Definir contrato do endpoint.
3. Criar DTOs de entrada, query, params e response.
4. Criar ou ajustar entidades de domínio.
5. Criar repository e interface.
6. Implementar service com regra de negócio.
7. Criar controller com Swagger.
8. Criar testes unitários.
9. Criar testes de integração quando houver banco.
10. Criar testes E2E quando houver fluxo HTTP relevante.
11. Atualizar documentação.
12. Rodar lint, build e testes.

Nenhuma funcionalidade deve ser considerada concluída sem validação, testes mínimos e documentação Swagger.

---

## 17. Roadmap de Implementação

### Etapa 1 - Bootstrap do projeto NestJS

Objetivo:

- Criar base NestJS com TypeScript, ESLint, Prettier e estrutura inicial de pastas.

Arquivos envolvidos:

- `package.json`
- `tsconfig.json`
- `.eslintrc`
- `.prettierrc`
- `src/main.ts`
- `src/app.module.ts`
- Pastas base em `src/`

Dependências:

- Nenhuma etapa anterior.

Critérios de conclusão:

- Aplicação inicia localmente.
- Lint executa.
- Build TypeScript passa.
- Estrutura de pastas segue esta especificação.

### Etapa 2 - Configuração global

Objetivo:

- Configurar `ConfigModule`, validação de ambiente, prefixo global, pipes, filters e interceptors base.

Arquivos envolvidos:

- `src/config/*`
- `src/common/filters/*`
- `src/common/interceptors/*`
- `src/main.ts`

Dependências:

- Etapa 1.

Critérios de conclusão:

- `.env.example` criado.
- Variáveis obrigatórias validadas.
- Erros seguem padrão definido.
- Respostas seguem wrapper padrão.

### Etapa 3 - Docker e PostgreSQL

Objetivo:

- Criar ambiente local com Docker, Docker Compose e PostgreSQL.

Arquivos envolvidos:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `.env.example`

Dependências:

- Etapa 1.

Critérios de conclusão:

- PostgreSQL sobe via Compose.
- API consegue ler `DATABASE_URL`.
- Healthcheck do banco configurado.

### Etapa 4 - Prisma

Objetivo:

- Integrar Prisma ORM, criar schema inicial e PrismaService.

Arquivos envolvidos:

- `prisma/schema.prisma`
- `prisma/migrations/*`
- `prisma/seed.ts`
- `src/database/prisma.module.ts`
- `src/database/prisma.service.ts`

Dependências:

- Etapas 2 e 3.

Critérios de conclusão:

- Prisma Client gerado.
- Migration inicial aplicada.
- Seed local executável.
- Conexão com PostgreSQL validada.

### Etapa 5 - Auth base

Objetivo:

- Implementar registro, login, hashing de senha, JWT access token e refresh token.

Arquivos envolvidos:

- `src/modules/auth/*`
- `src/modules/users/*`
- `src/common/guards/jwt-auth.guard.ts`
- `src/common/decorators/current-user.decorator.ts`

Dependências:

- Etapa 4.

Critérios de conclusão:

- Usuário registra.
- Usuário faz login.
- Access token é emitido.
- Refresh token é persistido como hash.
- Swagger documenta auth.

### Etapa 6 - Autorização

Objetivo:

- Implementar roles, permissions, guards e decorators.

Arquivos envolvidos:

- `src/common/guards/roles.guard.ts`
- `src/common/guards/permissions.guard.ts`
- `src/common/decorators/roles.decorator.ts`
- `src/common/decorators/permissions.decorator.ts`
- Ajustes em `auth` e `users`

Dependências:

- Etapa 5.

Critérios de conclusão:

- Rotas protegidas exigem JWT.
- Roles e permissions funcionam.
- Testes unitários dos guards passam.

### Etapa 7 - Categorias

Objetivo:

- Criar categorias financeiras padrão e permitir consulta para o front-end.

Arquivos envolvidos:

- `src/modules/categories/*`
- `prisma/schema.prisma`
- Nova migration se necessário.

Dependências:

- Etapas 4 e 5.

Critérios de conclusão:

- Usuário possui categorias padrão.
- Endpoint lista categorias do usuário.
- Soft delete respeitado.

### Etapa 8 - Transações

Objetivo:

- Implementar receitas e despesas com endpoints orientados ao front-end.

Arquivos envolvidos:

- `src/modules/transactions/*`
- `prisma/schema.prisma`
- Migration de transações.

Dependências:

- Etapas 5 e 7.

Critérios de conclusão:

- Criar receita.
- Criar despesa.
- Listar histórico por mês, ano e tipo.
- Excluir via soft delete.
- Valores usam decimal.
- Isolamento por usuário testado.

### Etapa 9 - Metas

Objetivo:

- Implementar metas por categoria e período.

Arquivos envolvidos:

- `src/modules/goals/*`
- `prisma/schema.prisma`
- Migration de metas.

Dependências:

- Etapas 7 e 8.

Critérios de conclusão:

- Criar ou atualizar meta.
- Consultar metas por mês e ano.
- Calcular progresso por categoria.

### Etapa 10 - Recorrências

Objetivo:

- Implementar transações recorrentes e processamento seguro por período.

Arquivos envolvidos:

- `src/modules/recurrences/*`
- `prisma/schema.prisma`
- Migration de recorrências.

Dependências:

- Etapas 7 e 8.

Critérios de conclusão:

- Criar recorrência.
- Listar recorrências ativas.
- Excluir recorrência.
- Processar recorrência sem duplicar no mesmo mês.

### Etapa 11 - Dashboard BFF

Objetivo:

- Criar endpoints agregados para tela principal.

Arquivos envolvidos:

- `src/modules/dashboard/*`

Dependências:

- Etapas 8, 9 e 10.

Critérios de conclusão:

- Endpoint retorna resumo mensal.
- Endpoint retorna dados de gráficos.
- Payload atende diretamente o front-end.
- Consultas filtram por usuário e período.

### Etapa 12 - Importação e exportação CSV

Objetivo:

- Migrar lógica de CSV do front-end para o backend.

Arquivos envolvidos:

- `src/modules/import-export/*`
- Validators de CSV.

Dependências:

- Etapa 8.

Critérios de conclusão:

- Exportação CSV retorna dados do usuário.
- Importação valida formato.
- Importação não mistura dados entre usuários.
- Erros de CSV são claros.

### Etapa 13 - Swagger completo

Objetivo:

- Revisar documentação OpenAPI de todos os módulos.

Arquivos envolvidos:

- Controllers.
- DTOs.
- `src/config/swagger.config.ts`

Dependências:

- Etapas 5 a 12.

Critérios de conclusão:

- Todos os endpoints documentados.
- Todos os DTOs possuem exemplos.
- Autenticação Bearer configurada.

### Etapa 14 - Testes E2E principais

Objetivo:

- Cobrir fluxos ponta a ponta usados pelo front-end.

Arquivos envolvidos:

- `test/*`
- Factories e helpers de teste.

Dependências:

- Etapas 5 a 12.

Critérios de conclusão:

- Fluxo de auth passa.
- Fluxo financeiro principal passa.
- Dashboard retorna dados esperados.
- Isolamento multiusuário testado.

### Etapa 15 - Hardening de produção

Objetivo:

- Reforçar segurança, logs, rate limit e configuração de produção.

Arquivos envolvidos:

- `src/config/*`
- `src/common/*`
- `Dockerfile`
- `docker-compose.yml`

Dependências:

- Etapas anteriores.

Critérios de conclusão:

- Helmet habilitado.
- Rate limit configurado.
- Logs sem dados sensíveis.
- Dockerfile otimizado.
- Secrets não versionados.

---

## Decisões Arquiteturais Consolidadas

- O backend será um BFF, não uma API CRUD genérica.
- O front-end deve receber respostas prontas para suas telas principais.
- Prisma será isolado em repositories.
- Valores financeiros devem usar decimal.
- Soft delete será padrão para dados principais.
- JWT access token será curto e refresh token será persistido como hash.
- Toda entrada externa será validada por DTOs.
- Swagger será parte obrigatória da entrega.
- Testes acompanharão cada etapa incremental.
- Regras de negócio ficarão em services, não em controllers.
- A arquitetura será modular, mas sem abstrações desnecessárias.
