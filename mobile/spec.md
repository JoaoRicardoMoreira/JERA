# Jera Mobile - Especificacao Principal

## 1. Objetivo

Criar a versao mobile do Jera mantendo equivalencia funcional e visual com a versao web existente em `apps/web`, reutilizando a API BFF atual em NestJS exposta sob `/api/v1`.

O app mobile deve permitir que o usuario acompanhe e gerencie sua vida financeira com os mesmos fluxos centrais do web:

- Autenticacao e criacao de conta.
- Dashboard mensal com saldo, rendas, gastos e proximos recorrentes.
- Listagem, criacao e exclusao de rendas.
- Listagem, criacao e exclusao de gastos.
- Gerenciamento e processamento de recorrentes.
- Visualizacao e configuracao de investimentos.
- Configuracoes de conta e logout.

O mobile deve preservar a identidade deep dark, a marca Jera e a hierarquia visual do dashboard redesenhado, mas adaptar navegacao, tabelas, formularios e modais para uso com toque e telas pequenas.

## 2. Escopo Funcional

### 2.1 Obrigatorio

- Login com email e senha.
- Registro de novo usuario.
- Persistencia segura de access token, refresh token e usuario autenticado.
- Refresh automatico em respostas `401` quando houver refresh token.
- Logout com revogacao do refresh token.
- Protecao de rotas autenticadas.
- Dashboard com periodo atual, saldo disponivel, total de rendas, total de gastos e proximos recorrentes.
- Acoes rapidas para criar renda e gasto a partir do dashboard.
- Tela de rendas com total do periodo, lista, empty state, criacao e exclusao.
- Tela de gastos com total do periodo, breakdown por categoria, lista, empty state, criacao e exclusao.
- Tela de recorrentes com lista de ativos, criacao, exclusao e processamento do periodo.
- Tela de investimentos com resumo, taxa mensal, aporte do periodo, historico de aportes e grafico simplificado.
- Tela de configuracoes com informacoes da sessao e logout.
- Reuso dos endpoints atuais da API.
- Estados de loading, erro, sucesso e vazio em todos os fluxos principais.
- Respeito a permissoes retornadas no JWT/usuario.

### 2.2 Desejavel

- Filtro de mes/ano no mobile, equivalente ao estado de filtros do web.
- Pull-to-refresh nas telas de dashboard, rendas, gastos, recorrentes e investimentos.
- Confirmacao antes de exclusoes.
- Feedback por toast/snackbar em criacao, exclusao, importacao/processamento e falhas.
- Biometria/local authentication para reabrir sessao ja autenticada.
- Grafico mobile de investimentos com tooltip/touch feedback.
- Skeletons nas telas principais.
- Deep links internos para abrir tela especifica apos notificacao futura.

### 2.3 Futuro

- Importacao/exportacao CSV no mobile.
- Backup/cola JSON, caso volte a ser parte do produto mobile.
- Aba dedicada de graficos analiticos.
- Metas por categoria como tela propria, caso o web volte a expor esse fluxo no shell atual.
- Open Finance, quando sair do estado "em breve".
- Notificacoes push de recorrentes e fechamento de periodo.
- Modo offline com fila de sincronizacao.

## 3. Fluxos Criticos

Os fluxos abaixo devem funcionar no mobile com a mesma regra de negocio do web:

- Login/registro deve armazenar `accessToken`, `refreshToken` e `user`.
- Chamada protegida deve enviar `Authorization: Bearer <accessToken>`.
- Em `401`, o app deve chamar `POST /auth/refresh`; se funcionar, repetir a requisicao original.
- Se refresh falhar, limpar sessao e enviar usuario para login.
- Criar gasto deve chamar `POST /transactions/expense` com `amount`, `occurredAt`, `description` e `categoryId` opcional.
- Criar renda deve chamar `POST /transactions/income` com os mesmos campos.
- Historico mensal deve chamar `GET /transactions/history?month=&year=&type=&page=&limit=`.
- Exclusao deve ser soft delete via `DELETE /transactions/:id`.
- Criar recorrente deve chamar `POST /recurrences`.
- Processar recorrentes deve chamar `POST /recurrences/process` para o mes/ano filtrado.
- Investimentos devem usar `GET /investments/overview`, `PUT /investments/config`, `PUT /investments/contributions` e `DELETE /investments/contributions/:id`.

## 4. Mapeamento de Telas

| Web | Mobile | Adaptacao |
|---|---|---|
| `/login` | `LoginScreen` | Assinatura Jera no topo, card de formulario em tela cheia, teclado evitando sobrepor campos. |
| `/dashboard` | `DashboardScreen` | Hero de saldo, cards empilhados, proximos recorrentes em lista compacta, acoes em header/bottom sheet. |
| `/rendas` | `IncomesScreen` | Tabela vira lista de cards/rows tocaveis; botao flutuante ou header action para nova renda. |
| `/gastos` | `ExpensesScreen` | Breakdown por categoria em barras, transacoes em lista, exclusao por acao contextual. |
| `/recorrentes` | `RecurrencesScreen` | Lista de recorrentes, botao de criar, acao secundaria para processar periodo. |
| Investimentos panel | `InvestmentsScreen` | Tela dedicada no mobile; cards de resumo, formulario de taxa/aporte em bottom sheets, grafico responsivo. |
| `/configuracoes` | `SettingsScreen` | Sessao, logout, versao do app e informacoes basicas. |

### 4.1 Navegacao

Usar navegacao autenticada com tabs inferiores para os fluxos principais:

- Dashboard
- Rendas
- Gastos
- Recorrentes
- Mais

`Mais` deve abrir uma stack com:

- Investimentos
- Configuracoes

Motivo: o web usa sidebar, mas no mobile uma sidebar fixa reduziria area util. Bottom tabs preservam acesso rapido aos fluxos centrais e seguem padrao mobile.

### 4.2 Formularios e Modais

No web os formularios aparecem em modais. No mobile devem virar bottom sheets ou telas empilhadas curtas:

- `IncomeFormSheet`
- `ExpenseFormSheet`
- `RecurrenceFormSheet`
- `InvestmentConfigSheet`
- `InvestmentContributionSheet`
- `ConfirmDeleteSheet`

Motivo: bottom sheets sao mais ergonomicos em telas pequenas e evitam modais centralizados apertados.

## 5. Integracao com a API

### 5.1 Endpoints Reutilizados

Base URL local:

```text
http://localhost:3000/api/v1
```

Em dispositivo fisico, a base URL deve ser configuravel via ambiente, pois `localhost` aponta para o proprio aparelho.

| Modulo | Endpoint | Uso mobile |
|---|---|---|
| Auth | `POST /auth/register` | Criar conta e iniciar sessao. |
| Auth | `POST /auth/login` | Entrar. |
| Auth | `POST /auth/refresh` | Rotacionar refresh token. |
| Auth | `POST /auth/logout` | Revogar sessao. |
| Users | `GET /users/me` | Restaurar sessao e validar usuario atual. |
| Categories | `GET /categories` | Popular selects de rendas, gastos e recorrentes. |
| Dashboard | `GET /dashboard/monthly-summary` | Dashboard e totais das telas. |
| Dashboard | `GET /dashboard/charts` | Breakdown de gastos/metas quando necessario. |
| Transactions | `POST /transactions/expense` | Criar gasto. |
| Transactions | `POST /transactions/income` | Criar renda. |
| Transactions | `GET /transactions/history` | Listar rendas/gastos por periodo. |
| Transactions | `DELETE /transactions/:id` | Excluir renda/gasto. |
| Recurrences | `POST /recurrences` | Criar recorrente. |
| Recurrences | `GET /recurrences` | Listar recorrentes ativos. |
| Recurrences | `POST /recurrences/process` | Processar recorrentes do periodo. |
| Recurrences | `DELETE /recurrences/:id` | Excluir recorrente. |
| Goals | `GET /goals` | Desejavel/futuro se tela de metas mobile for criada. |
| Goals | `PUT /goals` | Desejavel/futuro se edicao de metas for criada. |
| Investments | `GET /investments/overview` | Tela de investimentos. |
| Investments | `PUT /investments/config` | Atualizar taxa mensal. |
| Investments | `PUT /investments/contributions` | Criar/atualizar aporte mensal. |
| Investments | `DELETE /investments/contributions/:id` | Excluir aporte. |
| ImportExport | `GET /import-export/csv/export` | Futuro/desejavel. |
| ImportExport | `POST /import-export/csv/import` | Futuro/desejavel. |

### 5.2 Possiveis Ajustes de API

Nenhum ajuste de API e bloqueante para a primeira versao mobile.

Ajustes desejaveis para melhorar mobile:

- Endpoint agregado `GET /mobile/home?month=&year=` retornando summary, proximos recorrentes e totals em uma chamada.
- Paginacao por cursor ou `limit` padrao mobile menor para `transactions/history`.
- Endpoint de perfil que retorne flags de permissoes ja agrupadas para UI.

Esses ajustes devem ser tratados como otimizacao futura. A implementacao inicial deve reaproveitar a API atual.

### 5.3 Erros

O app deve normalizar o padrao atual de erro da API:

- `message`
- `code`
- `statusCode`
- `path`
- `timestamp`
- possiveis mensagens de validacao agregadas

Mensagens para usuario devem ser curtas:

- `Nao foi possivel carregar os dados.`
- `Verifique os campos e tente novamente.`
- `Sessao expirada. Entre novamente.`
- `Voce nao tem permissao para executar esta acao.`

## 6. Experiencia Mobile

### 6.1 Padroes

- Toques com area minima de 44x44.
- Bottom tabs para navegacao principal.
- Headers compactos com titulo, periodo e acao primaria.
- Bottom sheets para formularios e confirmacoes.
- Listas verticais no lugar de tabelas.
- Pull-to-refresh para recarregar telas.
- Empty states especificos e curtos.
- Loading local por tela e por acao.
- Feedback de sucesso/falha por snackbar/toast.

### 6.2 Adaptacao Visual

Manter:

- Fundo deep dark.
- Verde como assinatura Jera.
- Rose para gastos/erros.
- Violeta para investimentos.
- Superficies discretas com bordas finas.
- Logo Jera baseada nos assets em `apps/web/src/assets/brand`.

Adaptar:

- Sidebar vira tab bar inferior.
- Cards ficam empilhados.
- Tabelas viram listas.
- Modais viram bottom sheets.
- Hero do saldo reduz escala em celulares pequenos.

## 7. Arquitetura do App Mobile

### 7.1 Stack Recomendada

Usar React Native com Expo e TypeScript.

Justificativa:

- Mantem TypeScript como linguagem compartilhada com API e web.
- Permite desenvolvimento rapido com Expo Go/dev client.
- Facilita build Android/iOS com EAS no futuro.
- Ecossistema maduro para navegacao, storage seguro, formularios, charts e testes.
- Pode viver no monorepo em `apps/mobile` sem alterar o front web antigo.

Bibliotecas recomendadas:

- `expo`
- `react-native`
- `typescript`
- `expo-router` ou `@react-navigation/native`
- `expo-secure-store`
- `react-native-safe-area-context`
- `react-native-gesture-handler`
- `@gorhom/bottom-sheet`
- `@tanstack/react-query`
- `axios`
- `react-hook-form`
- `zod`
- `victory-native` ou `react-native-gifted-charts`
- `jest`
- `@testing-library/react-native`

Preferencia: `expo-router` para rotas por arquivo e stacks/tabs simples.

### 7.2 Estrutura de Pastas

```text
apps/mobile/
  app/
    _layout.tsx
    (auth)/
      login.tsx
      register.tsx
    (tabs)/
      _layout.tsx
      dashboard.tsx
      incomes.tsx
      expenses.tsx
      recurrences.tsx
      more.tsx
    investments.tsx
    settings.tsx
  src/
    assets/
      brand/
    components/
      feedback/
      forms/
      layout/
      lists/
      metrics/
      navigation/
      sheets/
    config/
      env.ts
    features/
      auth/
      dashboard/
      transactions/
      recurrences/
      investments/
      categories/
      settings/
    lib/
      api/
      dates/
      money/
      permissions/
      storage/
    state/
      query-client.ts
    theme/
      colors.ts
      spacing.ts
      typography.ts
      components.ts
    types/
      bff.models.ts
```

### 7.3 Camadas

- `app/`: rotas, layouts e composicao de telas.
- `features/*`: regras de tela e casos de uso por dominio.
- `components/*`: componentes visuais reutilizaveis sem regra de negocio pesada.
- `lib/api`: cliente HTTP, interceptors, normalizacao de erro e auth refresh.
- `lib/storage`: armazenamento seguro de tokens e usuario.
- `theme`: tokens equivalentes ao visual web.
- `types`: contratos BFF equivalentes a `apps/web/src/app/finance/models/bff.models.ts`.

## 8. Design System Mobile

Componentes base obrigatorios:

- `AppScreen`
- `AppHeader`
- `BottomTabBar`
- `MetricCard`
- `MoneyText`
- `ActionButton`
- `IconButton`
- `TextField`
- `SelectField`
- `DateField`
- `SegmentedControl`
- `BottomSheet`
- `EmptyState`
- `ErrorState`
- `LoadingState`
- `TransactionListItem`
- `RecurrenceListItem`
- `CategoryProgressItem`
- `InvestmentSummaryCard`
- `ConfirmActionSheet`

Tokens iniciais:

- `bg`: `#09090b`
- `bgSoft`: `#0c0c0f`
- `surface`: `rgba(24, 24, 27, 0.86)`
- `surfaceMuted`: `rgba(39, 39, 42, 0.54)`
- `border`: `rgba(255, 255, 255, 0.08)`
- `text`: `#f4f4f5`
- `textMuted`: `#a1a1aa`
- `textSubtle`: `#71717a`
- `income`: `#34d399`
- `expense`: `#fb7185`
- `investment`: `#a78bfa`
- `warning`: `#fbbf24`

## 9. Seguranca e Autenticacao

- Access token e refresh token devem ser armazenados em `expo-secure-store`.
- Usuario autenticado pode ser armazenado em secure store ou storage persistente protegido, evitando expor tokens em AsyncStorage.
- Rotas autenticadas devem validar sessao antes de renderizar tabs.
- Refresh token deve ser rotacionado conforme resposta de `/auth/refresh`.
- Logout deve chamar `/auth/logout` com refresh token atual e limpar storage mesmo se a API falhar.
- Permissoes devem ser lidas de `user.permissions`.
- Botoes devem ser ocultados ou desabilitados quando a permissao necessaria estiver ausente.
- Dados sensiveis nao devem ser logados.

## 10. Permissoes

Permissoes esperadas pela API:

- `dashboard:read`
- `transactions:read`
- `transactions:create`
- `transactions:delete`
- `goals:manage`
- `recurrences:manage`
- `investments:read`
- `investments:manage`

O app deve centralizar helpers:

- `hasPermission(permission)`
- `hasAnyPermission(permissions)`
- `canCreateTransaction`
- `canDeleteTransaction`
- `canManageRecurrences`
- `canReadInvestments`
- `canManageInvestments`

## 11. Estrategia de Implementacao

A implementacao deve ser incremental:

1. Setup Expo em `apps/mobile`.
2. Tokens visuais e assets Jera.
3. Cliente API e normalizacao de erro.
4. Auth/storage/refresh/protecao de rotas.
5. Navegacao principal.
6. Dashboard.
7. Rendas.
8. Gastos.
9. Recorrentes.
10. Investimentos.
11. Configuracoes.
12. Qualidade, testes e QA de equivalencia.

Cada task deve entregar um estado validavel e nao deve exigir reanalise completa do projeto.

## 12. Criterios de Equivalencia Web x Mobile

### 12.1 Checklist Funcional

- [ ] Login usa o mesmo endpoint do web.
- [ ] Registro usa o mesmo endpoint do web.
- [ ] Refresh token funciona em erro `401`.
- [ ] Logout revoga sessao.
- [ ] Dashboard exibe o mesmo saldo do web para o mesmo mes/ano.
- [ ] Dashboard exibe o mesmo total de rendas.
- [ ] Dashboard exibe o mesmo total de gastos.
- [ ] Dashboard exibe os mesmos proximos recorrentes.
- [ ] Rendas lista os mesmos itens do web.
- [ ] Gastos lista os mesmos itens do web.
- [ ] Breakdown de gastos por categoria bate com o web.
- [ ] Criar renda aparece no web apos refresh.
- [ ] Criar gasto aparece no web apos refresh.
- [ ] Excluir renda/gasto remove do web apos refresh.
- [ ] Criar recorrente aparece no web.
- [ ] Processar recorrentes cria transacoes equivalentes.
- [ ] Investimentos exibem total aportado, patrimonio, taxa e aportes equivalentes.
- [ ] Permissoes bloqueiam acoes como no web.

### 12.2 Checklist Visual

- [ ] Logo Jera igual ao asset usado no web.
- [ ] Tema deep dark preservado.
- [ ] Verde usado para renda/saldo positivo/marca.
- [ ] Rose usado para gastos/erros.
- [ ] Violeta usado para investimentos.
- [ ] Superficies e bordas coerentes com `visual-identity-spec.md`.
- [ ] Dashboard mobile preserva hierarquia da versao web.
- [ ] Listas substituem tabelas sem perder campos.
- [ ] Formularios preservam campos e validacoes.

### 12.3 Checklist de Estados

- [ ] Loading inicial.
- [ ] Loading de mutacao.
- [ ] Empty state de rendas.
- [ ] Empty state de gastos.
- [ ] Empty state de recorrentes.
- [ ] Empty state de investimentos.
- [ ] Erro de permissao `403`.
- [ ] Erro de validacao `400`.
- [ ] Sessao expirada.
- [ ] Falha de rede.

## 13. Testes e Qualidade

### 13.1 Unitarios

- Formatacao de moeda.
- Formatacao de datas.
- Mappers BFF -> view model.
- Normalizacao de erros.
- Helpers de permissao.
- Storage/auth state.

### 13.2 Integracao

- Cliente API anexando bearer token.
- Refresh token e retry de request.
- Login salvando sessao.
- Logout limpando sessao.
- Queries de dashboard/transacoes/recorrentes/investimentos.

### 13.3 Fluxos

Testar manualmente em simulador e dispositivo real:

- Login.
- Criar renda.
- Criar gasto.
- Excluir transacao.
- Criar recorrente.
- Processar recorrentes.
- Atualizar taxa de investimento.
- Criar aporte.
- Logout.

### 13.4 Validacoes Tecnicas

- `npm --prefix apps/mobile lint`
- `npm --prefix apps/mobile test`
- `npm --prefix apps/mobile typecheck`
- Execucao no Expo em Android/iOS quando disponivel.

## 14. Entregaveis

- `mobile/spec.md`
- `mobile/roadmap.md`
- `mobile/task-001.md` ate `mobile/task-024.md`
- Checklist de equivalencia neste documento e no roadmap.

