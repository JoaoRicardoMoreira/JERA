# Especificacao de Integracao Frontend x FinanceControl BFF

## 1. Visao Geral

### Objetivo

Este documento define a especificacao tecnica para integrar o frontend Angular existente em:

```text
C:\Users\joao\Documents\projetos\FinanceControl\FinanceControlFront
```

ao backend BFF NestJS criado em:

```text
C:\Users\joao\Documents\FinanceControl
```

O objetivo da integracao e substituir a persistencia e regras locais do frontend por chamadas ao BFF, mantendo a experiencia visual atual e movendo para o backend as responsabilidades que ja foram implementadas e validadas:

- Autenticacao e sessao.
- Persistencia de receitas e despesas.
- Categorias financeiras por usuario.
- Metas mensais por categoria.
- Recorrencias.
- Processamento de recorrencias.
- Dashboard mensal e graficos agregados.
- Importacao e exportacao CSV.

### Escopo

Esta especificacao cobre apenas a integracao do frontend com o backend ja existente. Ela nao cria novos endpoints no BFF e nao altera contratos atuais sem necessidade.

O frontend devera deixar de depender de `localStorage` como fonte principal de dados financeiros. O `localStorage` podera continuar sendo usado somente para dados de sessao, preferencias leves ou estrategia temporaria de migracao.

### Backend alvo

Base URL local esperada:

```text
http://localhost:3000/api/v1
```

Swagger local, quando habilitado:

```text
http://localhost:3000/docs
```

### Frontend atual

O frontend e uma aplicacao Angular 17 com:

- `FinanceService` como fachada de operacoes financeiras.
- `FinanceStore` baseado em `BehaviorSubject`.
- Persistencia local em `localStorage`.
- Calculo local de resumo, filtros, graficos, metas e recorrencias.
- CSV local em `src/app/utils/csv.ts`.

Arquivos principais atuais:

```text
src/app/services/finance.service.ts
src/app/state/finance.store.ts
src/app/models/transaction.ts
src/app/models/recurrence.ts
src/app/models/meta.ts
src/app/models/filters.ts
src/app/models/finance-state.ts
src/app/app.component.ts
src/app/app.config.ts
```

---

## 2. Principios da Integracao

### Backend como fonte de verdade

O BFF passa a ser a fonte de verdade para dados financeiros. O frontend nao deve mais calcular ou persistir dados financeiros permanentes como fonte principal.

Devem sair do frontend como responsabilidade principal:

- Persistencia de transacoes em `localStorage`.
- Calculo de saldo, total de renda e total de gasto.
- Calculo de gastos por categoria.
- Calculo de progresso de metas.
- Processamento de recorrencias.
- Montagem manual de CSV.
- Parsing manual de CSV para sobrescrever estado local.

Devem permanecer no frontend:

- Estado de tela.
- Filtros selecionados.
- Loading, empty states e error states.
- Adaptacao de dados para componentes existentes.
- Formatacao visual.
- Download/upload de arquivo via navegador.

### Integracao incremental

A migracao deve preservar o maximo possivel da UI atual. Primeiro cria-se uma camada de API e adapters, depois troca-se a implementacao interna do `FinanceService`.

Ordem recomendada:

1. Configurar ambiente e HTTP client.
2. Criar modelos do BFF e envelope padrao.
3. Implementar autenticacao.
4. Implementar interceptor JWT.
5. Integrar categorias.
6. Trocar criacao/listagem/exclusao de transacoes.
7. Integrar dashboard e graficos.
8. Integrar metas.
9. Integrar recorrencias.
10. Integrar CSV.
11. Remover dependencia de `localStorage` financeiro.

### Compatibilidade visual

Os componentes atuais podem continuar recebendo estruturas parecidas com:

```ts
Transaction {
  desc: string;
  valor: number;
  data: string;
  categoria?: string;
}
```

Porem essas estruturas devem ser tratadas como `ViewModel`, nao como modelo persistido. A conversao entre API e UI deve ocorrer em adapters/mappers.

---

## 3. Arquitetura Frontend Proposta

### Pastas novas ou ajustadas

Estrutura recomendada:

```text
src/app/
  core/
    api/
      api-response.model.ts
      api-error.model.ts
      api-client.service.ts

    auth/
      auth.models.ts
      auth.service.ts
      auth.interceptor.ts
      auth.guard.ts
      token-storage.service.ts

    config/
      environment.token.ts

  finance/
    models/
      bff.models.ts
      finance-view.models.ts

    services/
      categories-api.service.ts
      transactions-api.service.ts
      dashboard-api.service.ts
      goals-api.service.ts
      recurrences-api.service.ts
      import-export-api.service.ts

    mappers/
      transaction.mapper.ts
      recurrence.mapper.ts
      goal.mapper.ts
      dashboard.mapper.ts

  services/
    finance.service.ts

  state/
    finance.store.ts
```

### Responsabilidades

`core/api/`

- Centraliza tipos comuns de resposta e erro.
- Opcionalmente encapsula `HttpClient`.

`core/auth/`

- Registra, autentica, renova e encerra sessao.
- Armazena tokens.
- Injeta `Authorization: Bearer`.
- Redireciona usuarios nao autenticados.

`finance/services/`

- Um service por modulo do BFF.
- Cada service conhece apenas os endpoints do seu dominio.
- Nenhum service deve manipular diretamente DOM ou componentes.

`finance/mappers/`

- Converte DTOs do BFF para ViewModels usados pelos componentes atuais.
- Converte entradas dos formularios atuais para DTOs do BFF.

`FinanceService`

- Continua como fachada para componentes.
- Passa a orquestrar chamadas aos API services.
- Mantem Observables usados pela tela.

`FinanceStore`

- Deve deixar de persistir dados financeiros em `localStorage`.
- Deve armazenar cache de tela, loading e ultimos dados retornados pela API.

---

## 4. Configuracao de Ambiente

### Arquivos de ambiente

Criar ou ajustar:

```text
src/environments/environment.ts
src/environments/environment.development.ts
src/environments/environment.production.ts
```

Caso o projeto Angular atual nao use `src/environments`, criar conforme padrao Angular.

### Variaveis esperadas

Desenvolvimento:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api/v1',
};
```

Producao:

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.financecontrol.com/api/v1',
};
```

### CORS

O backend deve permitir a origem do frontend via `CORS_ORIGINS`.

Para `ng serve`, a origem esperada e:

```text
http://localhost:4200
```

No backend:

```env
CORS_ORIGINS=http://localhost:4200
```

---

## 5. Padrao de Resposta da API

### Sucesso

Todas as respostas JSON do BFF sao envelopadas pelo `ResponseInterceptor`.

Formato esperado:

```ts
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    requestId?: string;
    [key: string]: unknown;
  };
}
```

Exemplo:

```json
{
  "success": true,
  "data": {
    "totalIncome": "5000.00",
    "totalExpense": "250.00"
  },
  "meta": {
    "requestId": "ce1bcc3c-7a3e-44ce-b980-095912dca1cc"
  }
}
```

### Erro

Formato esperado:

```ts
interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  code: string;
  details?: unknown[];
  path: string;
  timestamp: string;
}
```

Exemplo:

```json
{
  "success": false,
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Usuario autenticado nao encontrado no contexto da requisicao.",
  "code": "AUTHENTICATION_REQUIRED",
  "path": "/api/v1/users/me",
  "timestamp": "2026-07-03T19:50:55.000Z"
}
```

### Regra frontend

O frontend deve sempre acessar `response.data` em respostas JSON.

O frontend nao deve assumir que `message` e sempre string; em erros de validacao pode ser array ou estrutura de detalhes.

---

## 6. Autenticacao e Sessao

### Endpoints

#### Registrar

```http
POST /auth/register
```

Request:

```ts
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
```

Response:

```ts
interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
```

#### Login

```http
POST /auth/login
```

Request:

```ts
interface LoginRequest {
  email: string;
  password: string;
}
```

Response: `AuthResponse`

#### Refresh

```http
POST /auth/refresh
```

Request:

```ts
interface RefreshTokenRequest {
  refreshToken: string;
}
```

Response: `AuthResponse`

#### Logout

```http
POST /auth/logout
```

Request:

```ts
interface LogoutRequest {
  refreshToken: string;
}
```

Response:

```ts
ApiResponse<null>
```

Observacao: o endpoint retorna `void` no controller. O interceptor pode envelopar como resposta sem `data` ou com `data` nulo, dependendo do comportamento em runtime. O frontend deve tratar `200 OK` como sucesso independentemente do corpo.

### Modelo de usuario

```ts
interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: Array<'USER' | 'ADMIN'>;
  permissions: string[];
}
```

### Armazenamento de tokens

Opcao recomendada inicial:

- `accessToken`: memoria + fallback em `localStorage`.
- `refreshToken`: `localStorage`.

Opcao mais segura futura:

- Migrar refresh token para cookie httpOnly se o backend for adaptado.

### TokenStorageService

Responsabilidades:

- `getAccessToken()`
- `getRefreshToken()`
- `setSession(authResponse)`
- `clearSession()`
- `hasSession()`

### AuthInterceptor

Deve:

- Adicionar `Authorization: Bearer <accessToken>` em rotas protegidas.
- Ignorar `/auth/login`, `/auth/register` e `/auth/refresh` para evitar loops.
- Em `401`, tentar refresh uma unica vez se houver refresh token.
- Se refresh falhar, limpar sessao e redirecionar para tela de login.

### Rotas protegidas

Se o frontend criar tela de login, as rotas financeiras devem usar `AuthGuard`.

Fluxo:

1. Usuario entra na app.
2. `AuthService.restoreSession()` tenta carregar tokens.
3. Se houver access token valido, chama `GET /users/me`.
4. Se access token falhar e houver refresh token, chama `/auth/refresh`.
5. Se nao houver sessao valida, mostra login.

---

## 7. Contratos Financeiros do BFF

### Tipos comuns

```ts
type TransactionType = 'INCOME' | 'EXPENSE';
type RecurrenceFrequency = 'MONTHLY';
type RecurrenceStatus = 'ACTIVE' | 'INACTIVE';
```

Valores monetarios no BFF sao strings decimais:

```ts
amount: '125.50'
```

No frontend, para exibicao e graficos, converter para `number` somente na camada de ViewModel.

Regra:

- DTO de request para backend: string decimal.
- ViewModel/componentes: number quando necessario.
- Nunca enviar float bruto sem formatar para duas casas.

---

## 8. Categorias

### Endpoint

```http
GET /categories
Authorization: Bearer <token>
```

Response:

```ts
interface CategoryResponse {
  id: string;
  name: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}
```

### Uso no frontend

Substituir:

```ts
categories = ['Alimentacao', 'Transporte', ...]
```

por categorias vindas da API.

Separar categorias por tipo:

```ts
incomeCategories = categories.filter(c => c.type === 'INCOME');
expenseCategories = categories.filter(c => c.type === 'EXPENSE');
```

### Impacto nos componentes

`ExpenseFormComponent` atualmente emite `categoria` como nome. A integracao deve alterar para emitir `categoryId`.

Compatibilidade temporaria:

```ts
interface ExpenseFormValue {
  desc: string;
  valor: number;
  data: string;
  categoria: string;
  categoryId?: string;
}
```

Meta: remover dependencia de nome da categoria como identificador.

---

## 9. Transacoes

### Criar despesa

```http
POST /transactions/expense
```

Request:

```ts
interface CreateExpenseRequest {
  amount: string;
  categoryId?: string;
  description?: string;
  occurredAt: string;
}
```

Exemplo:

```json
{
  "amount": "250.00",
  "categoryId": "8eb51f08-94a7-4ac4-9372-5bffe0445b8e",
  "description": "Groceries",
  "occurredAt": "2026-07-04T12:00:00.000Z"
}
```

### Criar receita

```http
POST /transactions/income
```

Request:

```ts
interface CreateIncomeRequest {
  amount: string;
  categoryId?: string;
  description?: string;
  occurredAt: string;
}
```

### Historico

```http
GET /transactions/history?month=7&year=2026&type=EXPENSE&page=1&limit=20
```

Query obrigatoria:

- `month`: 1 a 12.
- `year`: 2000 a 2100.

Query opcional:

- `type`: `INCOME` ou `EXPENSE`.
- `page`
- `limit`

Response:

```ts
interface TransactionResponse {
  id: string;
  amount: string;
  type: TransactionType;
  categoryId: string | null;
  categoryName: string | null;
  description: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}
```

Observacao: o controller retorna um resultado paginado envelopado. O frontend deve suportar:

```ts
interface PaginatedData<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

### Excluir transacao

```http
DELETE /transactions/:id
```

Response:

```http
204 No Content
```

### Mapeamento do modelo atual

Modelo atual:

```ts
interface Transaction {
  desc: string;
  valor: number;
  data: string;
  categoria?: string;
}
```

ViewModel recomendado:

```ts
interface TransactionViewModel {
  id: string;
  desc: string;
  valor: number;
  data: string;
  categoria?: string;
  categoryId?: string | null;
  type: 'renda' | 'gasto';
}
```

Mapper:

```ts
function toTransactionViewModel(dto: TransactionResponse): TransactionViewModel {
  return {
    id: dto.id,
    desc: dto.description ?? '',
    valor: Number(dto.amount),
    data: dto.occurredAt.slice(0, 10),
    categoria: dto.categoryName ?? undefined,
    categoryId: dto.categoryId,
    type: dto.type === 'INCOME' ? 'renda' : 'gasto',
  };
}
```

Mapper de request:

```ts
function toCreateTransactionRequest(input: TransactionViewModel): CreateExpenseRequest {
  return {
    amount: input.valor.toFixed(2),
    categoryId: input.categoryId ?? undefined,
    description: input.desc,
    occurredAt: `${input.data}T12:00:00.000Z`,
  };
}
```

---

## 10. Dashboard e Graficos

### Resumo mensal

```http
GET /dashboard/monthly-summary?month=7&year=2026
```

Response:

```ts
interface MonthlySummaryResponse {
  month: number;
  year: number;
  totalIncome: string;
  totalExpense: string;
  balance: string;
  transactionCount: number;
  goals: {
    totalGoalAmount: string;
    totalGoalSpentAmount: string;
    totalGoalRemainingAmount: string;
    progressPercentage: number;
    hasExceededGoals: boolean;
  };
}
```

### Graficos

```http
GET /dashboard/charts?month=7&year=2026
```

Response:

```ts
interface ChartsResponse {
  month: number;
  year: number;
  spendingByCategory: Array<{
    categoryId: string | null;
    categoryName: string;
    amount: string;
    percentage: number;
  }>;
  goalsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    goalAmount: string;
    spentAmount: string;
    remainingAmount: string;
    progressPercentage: number;
    isExceeded: boolean;
  }>;
}
```

### Substituicao do calculo local

Hoje o `FinanceStore` calcula:

```ts
summary: { totalRenda, totalGasto, saldo, metaGlobal }
charts: { categories, gastosPorCat, metasPorCat }
```

Novo fluxo:

1. Filtro de mes/ano muda.
2. Front chama `GET /dashboard/monthly-summary`.
3. Front chama `GET /dashboard/charts`.
4. Store atualiza ViewModel.

ViewModel de resumo:

```ts
interface SummaryViewModel {
  totalRenda: number;
  totalGasto: number;
  saldo: number;
  metaGlobal: number;
  transactionCount: number;
  goalProgressPercentage: number;
}
```

Mapper:

```ts
function toSummaryViewModel(dto: MonthlySummaryResponse): SummaryViewModel {
  return {
    totalRenda: Number(dto.totalIncome),
    totalGasto: Number(dto.totalExpense),
    saldo: Number(dto.balance),
    metaGlobal: Number(dto.goals.totalGoalAmount),
    transactionCount: dto.transactionCount,
    goalProgressPercentage: dto.goals.progressPercentage,
  };
}
```

---

## 11. Metas

### Criar ou atualizar meta

```http
PUT /goals
```

Request:

```ts
interface UpsertGoalRequest {
  categoryId: string;
  amount: string;
  month: number;
  year: number;
}
```

Response:

```ts
interface GoalResponse {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: string;
  spentAmount: string;
  remainingAmount: string;
  progressPercentage: number;
  isExceeded: boolean;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}
```

### Listar metas

```http
GET /goals?month=7&year=2026
```

Response:

```ts
GoalResponse[]
```

### Migracao do modelo atual

Modelo atual:

```ts
type MetaMap = Record<string, number>;
```

Novo ViewModel recomendado:

```ts
interface GoalViewModel {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  spentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  isExceeded: boolean;
}
```

Para compatibilidade temporaria com componentes atuais:

```ts
function goalsToMetaMap(goals: GoalResponse[]): Record<string, number> {
  return goals.reduce<Record<string, number>>((acc, goal) => {
    acc[goal.categoryName] = Number(goal.amount);
    return acc;
  }, {});
}
```

Meta final: componentes de metas devem usar `categoryId`, nao `categoryName`, para atualizar metas.

---

## 12. Recorrencias

### Criar recorrencia

```http
POST /recurrences
```

Request:

```ts
interface CreateRecurrenceRequest {
  amount: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  categoryId?: string;
  description?: string;
  startDate: string;
  endDate?: string;
}
```

Response:

```ts
interface RecurrenceResponse {
  id: string;
  amount: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  status: RecurrenceStatus;
  categoryId: string | null;
  categoryName: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  lastProcessedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Listar recorrencias

```http
GET /recurrences
```

Response:

```ts
RecurrenceResponse[]
```

### Processar recorrencias

```http
POST /recurrences/process
```

Request:

```ts
interface ProcessRecurrencesRequest {
  month: number;
  year: number;
}
```

Response:

```ts
interface ProcessRecurrencesResponse {
  month: number;
  year: number;
  processedCount: number;
  skippedCount: number;
  createdTransactionIds: string[];
}
```

### Excluir recorrencia

```http
DELETE /recurrences/:id
```

Response:

```http
204 No Content
```

### Migracao da logica atual

Hoje `FinanceStore.processRecurrents()` cria transacoes localmente quando a aplicacao carrega.

Novo comportamento:

- O frontend nao deve criar transacoes recorrentes localmente.
- Ao abrir a tela ou mudar periodo, o frontend pode chamar `POST /recurrences/process` para o mes/ano atual.
- Apos processar, recarregar historico, dashboard e graficos.
- O BFF ja evita duplicidade por periodo.

Mapeamento do modelo atual:

```ts
type RecurrenceType = 'gasto' | 'renda';
```

Para BFF:

```ts
const type = recurrence.type === 'gasto' ? 'EXPENSE' : 'INCOME';
```

O campo atual `dia` deve virar `startDate`, usando o mes/ano selecionado ou atual:

```ts
startDate = `${year}-${String(month).padStart(2, '0')}-${String(dia).padStart(2, '0')}T00:00:00.000Z`
```

---

## 13. Importacao e Exportacao CSV

### Exportar CSV

```http
GET /import-export/csv/export?month=7&year=2026&type=EXPENSE
```

Headers:

```http
Authorization: Bearer <token>
Accept: text/csv
```

Response:

```text
text/csv
```

Frontend:

- Usar `HttpClient` com `responseType: 'blob'`.
- Criar URL temporaria com `URL.createObjectURL`.
- Disparar download.

### Importar CSV

```http
POST /import-export/csv/import
Content-Type: multipart/form-data
```

FormData:

```ts
const formData = new FormData();
formData.append('file', file);
```

Response:

```ts
interface ImportCsvResponse {
  importedCount: number;
}
```

### Mudanca em relacao ao frontend atual

Hoje:

- `parseCsv(text)` roda no navegador.
- `overwriteData(rendas, gastos)` sobrescreve estado local.

Novo:

- O arquivo e enviado ao BFF.
- O BFF valida tudo antes de persistir.
- Apos sucesso, frontend recarrega historico/dashboard.
- `utils/csv.ts` deve ser removido ou mantido apenas se houver exportacao offline futura.

Formato esperado pelo BFF:

```text
type,amount,occurredAt,description,categoryId
EXPENSE,125.50,2026-07-03T12:00:00.000Z,Mercado,uuid-da-categoria
INCOME,3500.00,2026-07-03T12:00:00.000Z,Salario,uuid-da-categoria
```

---

## 14. Estado da Aplicacao

### Estado recomendado

Substituir `FinanceState` persistido por estado de tela:

```ts
interface FinanceUiState {
  filters: {
    month: number;
    year: number;
  };
  categories: CategoryResponse[];
  incomes: TransactionViewModel[];
  expenses: TransactionViewModel[];
  recurrences: RecurrenceViewModel[];
  goals: GoalViewModel[];
  summary: SummaryViewModel | null;
  charts: ChartsViewModel | null;
  loading: {
    initial: boolean;
    transactions: boolean;
    dashboard: boolean;
    mutation: boolean;
  };
  error: ApiErrorViewModel | null;
}
```

### Filtros

O backend exige `month` entre 1 e 12. O frontend atual usa `Date.getMonth()`, que retorna 0 a 11.

Regra de integracao:

- UI pode continuar usando 0 a 11 internamente se for conveniente.
- Toda chamada ao BFF deve enviar `month + 1`.
- Recomendado migrar a UI para 1 a 12 para reduzir bugs.

O filtro atual aceita `month: 'all'`. O BFF atual nao possui dashboard anual/all-months.

Regra:

- Para dashboard, metas e graficos, `month='all'` nao deve chamar endpoints mensais.
- Para historico/exportacao, pode omitir `month` apenas no endpoint de CSV export. O endpoint de historico exige mes.
- Se a UI mantiver "Todos", ela deve buscar dados de outra forma ou ocultar agregados mensais ate haver endpoint anual.

### Carregamento inicial autenticado

Ao entrar na tela principal:

1. Restaurar sessao.
2. Carregar `GET /users/me`.
3. Carregar categorias.
4. Processar recorrencias do mes atual, se aplicavel.
5. Carregar historico de receitas.
6. Carregar historico de despesas.
7. Carregar metas.
8. Carregar resumo mensal.
9. Carregar graficos.

Chamadas independentes podem rodar em paralelo depois de categorias e autenticacao.

---

## 15. Mapeamento de Operacoes do Frontend Atual

### `FinanceService.addExpense(expense)`

Atual:

- Atualiza store local.

Novo:

1. Mapear form para `CreateExpenseRequest`.
2. Chamar `POST /transactions/expense`.
3. Atualizar estado local com resposta ou recarregar periodo.
4. Recarregar dashboard/graficos/metas do periodo.

### `FinanceService.addIncome(income)`

Novo endpoint:

```http
POST /transactions/income
```

Depois de sucesso:

- Recarregar historico de receitas.
- Recarregar dashboard.

### `FinanceService.deleteItem(type, index)`

Atual:

- Exclui por indice local.

Novo:

- Componentes devem trabalhar com `id`.
- Chamar `DELETE /transactions/:id`.
- Remover item do estado por `id` ou recarregar historico.

### `FinanceService.setMeta(category, value)`

Atual:

- Atualiza `Record<categoryName, value>`.

Novo:

- Usar `categoryId`.
- Chamar `PUT /goals`.
- Recarregar metas, dashboard e graficos.

### `FinanceService.addRecurrence(rec)`

Novo:

- Chamar `POST /recurrences`.
- Recarregar lista de recorrencias.

### `FinanceService.deleteRecurrence(index)`

Novo:

- Componentes devem receber `id`.
- Chamar `DELETE /recurrences/:id`.

### `FinanceService.exportCsv(...)`

Novo:

- Ignorar arrays locais.
- Chamar `GET /import-export/csv/export`.

### `FinanceService.importCsv(file)`

Novo:

- Enviar `FormData`.
- Nao sobrescrever estado local.
- Recarregar dados do periodo.

---

## 16. Tratamento de Erros no Frontend

### Erros por status

`400 Bad Request`

- Mostrar erro de validacao.
- Mapear mensagens de campos quando possivel.

`401 Unauthorized`

- Tentar refresh uma vez.
- Se falhar, limpar sessao e redirecionar para login.

`403 Forbidden`

- Mostrar mensagem de permissao insuficiente.
- Nao repetir request automaticamente.

`404 Not Found`

- Mostrar mensagem de recurso nao encontrado.
- Em deletes, remover item local pode ser aceitavel se o recurso ja nao existe.

`409 Conflict`

- Usado principalmente em email duplicado.

`422 Unprocessable Entity`

- Mostrar erro de regra de negocio, por exemplo categoria de receita usada em despesa.

`429 Too Many Requests`

- Mostrar mensagem de limite de tentativas.
- Desabilitar temporariamente botao de login/importacao quando aplicavel.

`500 Internal Server Error`

- Mostrar mensagem generica.
- Registrar erro em console somente em desenvolvimento.

### Modelo de erro de UI

```ts
interface ApiErrorViewModel {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown[];
}
```

### Normalizador

Criar helper:

```ts
function normalizeApiError(error: unknown): ApiErrorViewModel {
  // Extrair HttpErrorResponse.error quando existir.
  // Garantir fallback para erro de rede.
}
```

---

## 17. Loading e Atualizacao de Tela

### Padrao de mutacoes

Para operacoes de escrita:

1. Setar `loading.mutation = true`.
2. Executar request.
3. Em sucesso, atualizar estado ou recarregar dados relacionados.
4. Em erro, preencher `error`.
5. Finalizar loading.

### Atualizacao apos cada operacao

Criar receita/despesa:

- Recarregar historico do tipo afetado.
- Recarregar dashboard.
- Recarregar graficos.
- Recarregar metas se despesa afetou progresso.

Criar/alterar meta:

- Recarregar metas.
- Recarregar dashboard.
- Recarregar graficos.

Criar/excluir recorrencia:

- Recarregar recorrencias.

Processar recorrencia:

- Recarregar historico.
- Recarregar dashboard.
- Recarregar graficos.

Importar CSV:

- Recarregar historico.
- Recarregar dashboard.
- Recarregar graficos.
- Recarregar metas.

---

## 18. Autorizacao e Permissoes

O BFF emite no token:

- `roles`
- `permissions`

Permissoes relevantes:

```ts
transactions:read
transactions:create
transactions:delete
goals:manage
recurrences:manage
dashboard:read
```

O frontend pode usar permissoes para ocultar acoes, mas nao deve confiar nelas como seguranca principal. O backend continua sendo a autoridade.

Helper recomendado:

```ts
hasPermission(permission: string): boolean
```

Uso:

- Esconder botao de importar CSV sem `transactions:create`.
- Esconder botoes de excluir sem `transactions:delete`.
- Esconder dashboard sem `dashboard:read`.

---

## 19. Testes Frontend

### Unitarios

Cobrir:

- `AuthService`
- `TokenStorageService`
- `AuthInterceptor`
- Mappers de transacao, meta, dashboard e recorrencia.
- `FinanceService` com API services mockados.

### Integracao Angular

Cobrir componentes principais com `HttpTestingController`:

- Login.
- Carregamento inicial da dashboard.
- Criacao de despesa.
- Criacao de receita.
- Atualizacao de meta.
- Importacao CSV.

### E2E manual inicial

Fluxo minimo:

1. Backend rodando em `localhost:3000`.
2. Frontend rodando em `localhost:4200`.
3. Usuario registra.
4. Usuario cria receita.
5. Usuario cria despesa.
6. Dashboard atualiza valores.
7. Usuario cria meta.
8. Grafico/metas atualizam.
9. Usuario cria recorrencia.
10. Usuario exporta CSV.
11. Usuario importa CSV valido.
12. Usuario faz logout.

---

## 20. Roadmap Incremental de Integracao

### Etapa 1 - Configuracao base de API

Objetivo:

- Criar environments com `apiBaseUrl`.
- Habilitar `provideHttpClient`.
- Criar tipos `ApiResponse<T>` e `ApiErrorResponse`.

Arquivos esperados:

```text
src/environments/environment.ts
src/environments/environment.development.ts
src/app/core/api/api-response.model.ts
src/app/core/api/api-error.model.ts
src/app/app.config.ts
```

Criterios:

- Front compila.
- Nenhuma tela muda comportamento ainda.

### Etapa 2 - Auth client

Objetivo:

- Criar `AuthService`, `TokenStorageService`, modelos de auth e tela/fluxo minimo de login.

Arquivos esperados:

```text
src/app/core/auth/auth.models.ts
src/app/core/auth/auth.service.ts
src/app/core/auth/token-storage.service.ts
```

Criterios:

- Registro funciona contra BFF.
- Login salva tokens.
- Logout remove tokens.

### Etapa 3 - Interceptor JWT e refresh

Objetivo:

- Adicionar access token em rotas protegidas.
- Implementar refresh em `401`.

Arquivos esperados:

```text
src/app/core/auth/auth.interceptor.ts
src/app/app.config.ts
```

Criterios:

- `GET /users/me` funciona autenticado.
- Sessao invalida redireciona para login.

### Etapa 4 - Categorias

Objetivo:

- Carregar categorias da API.
- Trocar listas fixas por categorias do backend.

Criterios:

- Formularios mostram categorias vindas do BFF.
- Despesa usa apenas categorias `EXPENSE`.
- Receita usa apenas categorias `INCOME`.

### Etapa 5 - Transacoes

Objetivo:

- Integrar criar receita, criar despesa, historico e delete.

Criterios:

- Criar receita persiste no banco.
- Criar despesa persiste no banco.
- Historico vem de `/transactions/history`.
- Delete usa `id`, nao indice.

### Etapa 6 - Dashboard e graficos

Objetivo:

- Substituir calculos locais por `/dashboard/monthly-summary` e `/dashboard/charts`.

Criterios:

- Cards usam dados do BFF.
- Graficos usam dados agregados do BFF.
- Mudanca de mes/ano recarrega dados.

### Etapa 7 - Metas

Objetivo:

- Integrar `PUT /goals` e `GET /goals`.

Criterios:

- Meta salva por categoria e periodo.
- Progresso vem do BFF.

### Etapa 8 - Recorrencias

Objetivo:

- Integrar CRUD e processamento de recorrencias.

Criterios:

- Criar recorrencia persiste no banco.
- Excluir recorrencia usa `id`.
- Processamento chama `/recurrences/process`.
- Front nao cria transacao recorrente localmente.

### Etapa 9 - CSV

Objetivo:

- Migrar export/import para BFF.

Criterios:

- Export baixa arquivo vindo da API.
- Import envia multipart.
- Apos import, tela recarrega dados.

### Etapa 10 - Remocao de persistencia local financeira

Objetivo:

- Remover `localStorage` como fonte de dados financeiros.

Criterios:

- `FinanceStore` guarda apenas estado de UI/cache.
- Refresh da pagina carrega dados do BFF.
- Dados antigos em `financeDataV*` nao quebram a app.

### Etapa 11 - Refinamento de UX

Objetivo:

- Loading, empty states e erros integrados.

Criterios:

- Erros de validacao sao exibidos.
- `401/403/429` possuem mensagens adequadas.
- Botoes evitam duplo submit.

### Etapa 12 - Validacao final

Objetivo:

- Garantir integracao ponta a ponta.

Criterios:

- `npm run build` do frontend passa.
- Testes Angular passam.
- Fluxo manual completo passa com backend e Postgres reais.

---

## 21. Decisoes Tecnicas

### Manter `FinanceService` como fachada

Justificativa:

- Reduz impacto nos componentes.
- Permite trocar implementacao local por API de forma incremental.
- Mantem a UI estavel durante a migracao.

### Introduzir mappers

Justificativa:

- O frontend usa nomes em portugues e valores numericos.
- O BFF usa contratos em ingles e valores monetarios como strings decimais.
- Mappers evitam espalhar conversoes pelos componentes.

### Remover indice como identificador

Justificativa:

- O backend trabalha com UUID.
- Indice local quebra com paginacao, filtros e ordenacao.
- Deletes devem usar `id`.

### Tratar `month` com cuidado

Justificativa:

- JavaScript usa meses 0 a 11.
- BFF usa meses 1 a 12.
- Essa diferenca deve ficar isolada em mapper/helper.

### CSV no backend

Justificativa:

- Garante validacao unica.
- Evita sobrescrever estado local sem persistencia real.
- Mantem isolamento por usuario.

---

## 22. Riscos e Cuidados

- O frontend atual nao possui tela de login visivel no mapeamento inicial; sera necessario criar fluxo de autenticacao ou adaptar uma tela existente.
- `month='all'` nao tem equivalencia direta em todos os endpoints atuais.
- Categorias atuais sao nomes fixos; backend exige `categoryId` para relacoes consistentes.
- Valores monetarios devem ser enviados como string decimal, nao number bruto.
- Recorrencias atuais usam `dia`; backend usa `startDate`.
- E2E deve rodar com backend e banco reais para validar contratos de verdade.
- Rate limit existe em auth e CSV; a UI deve evitar repeticoes agressivas.

---

## 23. Definicao de Pronto

A integracao frontend x BFF sera considerada concluida quando:

- A aplicacao Angular compilar sem erros.
- Usuario conseguir registrar/login/logout.
- Sessao for restaurada ou renovada por refresh token.
- Todas as chamadas protegidas enviarem JWT.
- Categorias forem carregadas do BFF.
- Receitas e despesas forem persistidas no backend.
- Dashboard e graficos vierem do BFF.
- Metas forem persistidas por categoria e periodo.
- Recorrencias forem persistidas/processadas pelo BFF.
- CSV export/import usar endpoints do BFF.
- `localStorage` nao for mais a fonte principal dos dados financeiros.
- Fluxo manual completo passar contra backend real.
- Testes unitarios principais dos services/mappers/interceptor passarem.
