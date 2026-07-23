# FinanceControl Visual Identity Spec

## 1. Objetivo

Este documento define a identidade visual e o sistema de interface do FinanceControl.

O objetivo e evoluir o tema deep dark atual para uma linguagem visual consistente, premium, operacional e escalavel, mantendo a aplicacao focada em uso diario, leitura rapida de dados financeiros e tomada de decisao.

Esta spec deve orientar futuras implementacoes de UI no monorepo, especialmente em `apps/web`, evitando telas visualmente desconectadas, classes Tailwind repetidas e decisoes esteticas inconsistentes.

---

## 2. Principios Visuais

### 2.1 Personalidade do Produto

FinanceControl deve parecer:

- Preciso
- Confiavel
- Calmo
- Moderno
- Premium
- Operacional
- Analitico

O app nao deve parecer uma landing page, dashboard generico ou tema neon excessivo. A interface deve priorizar clareza, contraste, previsibilidade e sensacao de controle.

### 2.2 Direcao Visual

A direcao principal e:

```text
Deep dark financeiro com base neutra, superficies sutis, bordas finas, verde como assinatura de confianca e violeta como cor de planejamento/investimentos.
```

### 2.3 O Que Evitar

- Paleta dominada por azul slate.
- Cards com aparencia muito azulada.
- Muitos glows simultaneos.
- Gradientes decorativos sem funcao.
- Cards aninhados.
- Hero sections ou composicoes de marketing.
- Textos explicando a interface dentro da UI.
- Muitos tamanhos de borda, sombra e radius diferentes.
- Elementos grandes demais para fluxos operacionais.

---

## 3. Paleta Oficial

### 3.1 Base

| Token | Valor | Uso |
|---|---:|---|
| `--color-bg` | `#09090b` | Fundo principal da aplicacao |
| `--color-bg-soft` | `#0c0c0f` | Fundo secundario, areas laterais |
| `--color-surface` | `rgba(24, 24, 27, 0.86)` | Cards, paineis, modais |
| `--color-surface-muted` | `rgba(39, 39, 42, 0.54)` | Areas internas, headers de tabela |
| `--color-surface-subtle` | `rgba(255, 255, 255, 0.035)` | Linhas, regioes de apoio |
| `--color-border` | `rgba(255, 255, 255, 0.08)` | Bordas principais |
| `--color-border-strong` | `rgba(255, 255, 255, 0.12)` | Bordas em foco ou containers ativos |

### 3.2 Texto

| Token | Valor | Uso |
|---|---:|---|
| `--color-text` | `#f4f4f5` | Texto principal |
| `--color-text-muted` | `#a1a1aa` | Labels, descricoes e headers |
| `--color-text-subtle` | `#71717a` | Empty states, metadados |
| `--color-text-disabled` | `#52525b` | Elementos desabilitados |

### 3.3 Semantica

| Token | Valor | Uso |
|---|---:|---|
| `--color-income` | `#34d399` | Renda, saldo positivo, sucesso |
| `--color-expense` | `#fb7185` | Gastos, risco, erro |
| `--color-investment` | `#a78bfa` | Investimentos, planejamento |
| `--color-info` | `#60a5fa` | Informacoes auxiliares |
| `--color-warning` | `#fbbf24` | Alertas, em breve, atencao |

### 3.4 Regras de Uso de Cor

- Verde deve ser a cor-assinatura do produto.
- Violeta deve ser reservado para investimentos, planejamento e acoes relacionadas.
- Vermelho/rose deve aparecer apenas em despesas, erros e alertas de limite.
- Azul deve ser usado com parcimonia em graficos ou informacoes secundarias.
- Amarelo deve ser usado apenas para status temporarios ou avisos.
- Superficies nunca devem puxar para azul como cor dominante.

---

## 4. Tipografia

### 4.1 Familia

Fonte principal:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

### 4.2 Escala

| Papel | Classe / Tamanho | Peso | Uso |
|---|---:|---:|---|
| Page title | `text-3xl` | `700` | Nome do produto ou titulo de tela |
| Section title | `text-2xl` | `700` | Titulo de aba ou area |
| Card title | `text-xl` | `600` | Titulo de card operacional |
| Metric value | `text-3xl` | `700` | Valores financeiros principais |
| Body | `text-sm` | `400/500` | Conteudo padrao |
| Label | `text-sm` | `500` | Labels de formulario |
| Micro label | `text-xs uppercase` | `600` | Headers, metric labels, badges |

### 4.3 Regras

- Nao usar font-size baseado em viewport.
- Nao usar letter spacing negativo.
- Usar uppercase apenas em labels curtos e headers de tabela.
- Valores financeiros devem ter peso visual maior que seus labels.

---

## 5. Tokens de Interface

Os tokens abaixo devem substituir gradualmente classes soltas duplicadas.

### 5.1 Shell

Classe sugerida:

```css
.fc-shell
```

Responsabilidade:

- Fundo geral da aplicacao.
- Gradientes radiais muito sutis.
- Cor base quase preta.

Regras:

- Gradientes devem ser discretos.
- Nenhum orb decorativo destacado.
- O conteudo deve ser o foco.

### 5.2 Surface

Classes sugeridas:

```css
.fc-surface
.fc-surface-muted
.fc-surface-flat
```

Uso:

- `fc-surface`: cards e paineis principais.
- `fc-surface-muted`: regioes internas, formularios internos, headers de tabela.
- `fc-surface-flat`: containers sem blur, usados em listas densas.

Regras:

- Radius padrao: `12px`.
- Radius maximo: `16px` para modais e paineis grandes.
- Borda sempre visivel, sutil.
- Sombra moderada, sem efeito neon permanente.

### 5.3 Inputs

Classe sugerida:

```css
.fc-field
```

Estados obrigatorios:

- Default
- Hover
- Focus
- Disabled
- Error

Regras:

- Fundo mais escuro que o card.
- Borda discreta.
- Focus com anel verde ou violeta conforme contexto.
- Altura consistente entre input, select e date.

### 5.4 Buttons

Classes sugeridas:

```css
.fc-button
.fc-button-primary
.fc-button-secondary
.fc-button-ghost
.fc-button-danger
.fc-button-investment
```

Uso:

- `primary`: acao principal da tela, geralmente verde.
- `secondary`: acoes neutras.
- `ghost`: acoes de baixa prioridade.
- `danger`: exclusao ou gasto.
- `investment`: acoes de investimento, violeta.

Regras:

- Botoes devem ter altura estavel.
- Icones devem ser usados quando ajudam reconhecimento.
- Texto do botao deve ser curto.
- Botoes de tabela devem priorizar icones com tooltip quando possivel.

### 5.5 Cards de Metrica

Classe sugerida:

```css
.fc-metric-card
```

Composicao:

- Label pequeno.
- Valor grande.
- Indicador de status opcional.
- Icone discreto opcional.
- Microcopy apenas quando agrega contexto.

Regras:

- Saldo e renda usam verde quando positivo.
- Gasto usa rose.
- Investimentos usam violeta/emerald.
- O card nao deve ter texto explicativo longo.

### 5.6 Tabelas

Classes sugeridas:

```css
.fc-table-shell
.fc-table-head
.fc-table-row
.fc-table-empty
```

Regras:

- Header de tabela deve usar superficie muted.
- Linhas devem ter hover sutil.
- Valores financeiros devem alinhar a direita.
- Acoes devem alinhar ao centro.
- Empty state deve ocupar altura suficiente para nao parecer bug.

### 5.7 Badges e Pills

Classes sugeridas:

```css
.fc-pill
.fc-pill-success
.fc-pill-danger
.fc-pill-warning
.fc-pill-investment
```

Uso:

- Status de saldo.
- Categoria em tabela.
- "Em breve".
- Estado de meta.

Regras:

- Badges devem ser pequenos.
- Usar border e background translucid.
- Evitar muitos badges coloridos no mesmo card.

---

## 6. Layout

### 6.1 Estrutura Geral

A aplicacao deve manter:

```text
Sidebar fixa/colapsavel
Main area fluida
Header operacional
Conteudo por abas
Modais para fluxos secundarios
```

### 6.2 Grid Principal

Desktop:

- Max width recomendado: `1280px`.
- Padding horizontal: `24px` a `32px`.
- Gap entre secoes: `32px`.
- Cards de metricas em 3 colunas.
- Area operacional em 1/3 + 2/3 quando houver formulario + tabela.

Mobile:

- Sidebar vira overlay.
- Cards empilham em 1 coluna.
- Tabelas podem rolar horizontalmente.
- Botoes do header quebram em multiplas linhas.

### 6.3 Dashboard

Ordem recomendada:

1. Header com periodo e acoes globais.
2. Alertas/loading, quando existirem.
3. Cards de metricas.
4. Acoes contextuais curtas.
5. Formulario de gasto/renda e historico.

O dashboard deve ser operacional, nao analitico demais. Graficos completos devem ficar na aba `Graficos`.

### 6.4 Graficos

A aba de graficos deve:

- Mostrar graficos em cards consistentes.
- Ter legends discretas.
- Usar tooltips dark.
- Evitar cores demais quando a informacao puder ser agrupada.
- Mostrar empty state quando nao houver dados.

### 6.5 Metas

A aba de metas deve:

- Mostrar progresso por categoria.
- Destacar categorias excedidas.
- Permitir editar metas sem sair da tela.
- Evitar texto longo.
- Usar barras de progresso consistentes com os cards de metricas.

### 6.6 Investimentos

A aba de investimentos deve parecer mais analitica e premium.

Elementos:

- Total aportado.
- Patrimonio estimado.
- Aporte do periodo.
- Taxa mensal.
- Equivalente anual.
- Grafico de evolucao patrimonial.
- Aporte manual.
- Historico de aportes.

Regras:

- Violeta deve representar aporte/planejamento.
- Verde deve representar patrimonio/rendimento.
- Grafico deve combinar barras de aporte com linha de patrimonio.
- Empty state deve orientar apenas o necessario.

### 6.7 Open Finance

Enquanto estiver indisponivel:

- Exibir badge `Em breve`.
- Mostrar um card simples e discreto.
- Nao ocupar peso visual maior que funcionalidades existentes.

---

## 7. Componentes Prioritarios

### 7.1 Sidebar

Problemas atuais:

- Azul aparece como cor dominante no item ativo.
- Colapso funciona, mas a identidade visual pode ficar mais alinhada ao verde.

Direcao:

- Item ativo deve usar verde sutil ou neutro com indicador verde.
- Open Finance pode manter warning badge.
- Icones devem ter tamanho consistente.
- Estado colapsado deve preservar tooltips futuramente.

### 7.2 Header

Problemas atuais:

- Botoes globais usam estilos diferentes demais.
- Export/import ainda tem visual mais azulado.

Direcao:

- Criar grupo de periodo.
- Criar grupo de acoes.
- Diferenciar apenas por importancia, nao por cores aleatorias.
- Export/Import podem ser secundarios, nao acoes heroicas.

### 7.3 Summary Cards

Direcao:

- Adicionar icones discretos.
- Melhorar label de "Saldo previsto no periodo".
- Manter valores como foco.
- Usar pill de status no saldo.
- Progress bar deve ter altura e cor padronizadas.

### 7.4 Forms

Direcao:

- Labels mais consistentes.
- Inputs com altura padrao.
- Mensagens de erro por campo futuramente.
- CTA principal com cor de contexto:
  - despesa: rose
  - renda: emerald
  - investimento: violet

### 7.5 Tabelas

Direcao:

- Aumentar refinamento visual de headers.
- Usar acoes com icone.
- Melhorar empty states.
- Preservar densidade operacional.

### 7.6 Modais

Direcao:

- Mesma surface dos cards.
- Overlay mais escuro.
- Titulo claro.
- Footer com botoes consistentes.
- Campos sempre com `fc-field`.

---

## 8. Estados da Interface

### 8.1 Loading

Estados de loading devem ser discretos.

Preferencia:

- Skeletons para cards e tabelas.
- Banner apenas para carregamentos globais.

### 8.2 Error

Erros devem:

- Usar rose.
- Ter texto curto.
- Aparecer perto do contexto quando possivel.
- Evitar bloquear toda a tela se a falha for local.

### 8.3 Empty State

Empty states devem ser especificos:

- `Nenhum gasto neste periodo`
- `Nenhuma renda neste periodo`
- `Cadastre um aporte para ver a evolucao do patrimonio`
- `Nenhuma meta definida`

Nao usar textos longos explicativos.

### 8.4 Disabled

Elementos desabilitados:

- Opacidade reduzida.
- Cursor `not-allowed`.
- Sem hover chamativo.

---

## 9. Acessibilidade

### 9.1 Contraste

- Texto principal deve ter contraste alto.
- Texto muted nao deve ficar abaixo de legibilidade aceitavel.
- Valores financeiros devem ser legiveis em cards e tabelas.

### 9.2 Foco

- Todo input, select, button e item de navegacao deve ter estado de foco visivel.
- Focus ring deve usar verde por padrao ou violeta em investimentos.

### 9.3 Movimento

- Animacoes devem ser sutis.
- Duracao recomendada: `150ms` a `220ms`.
- Evitar animacoes constantes.

### 9.4 Iconografia

- Icones devem ter significado claro.
- Tamanho padrao: `16px` para botoes, `20px` para navegacao/cards.
- Acoes destrutivas devem ter label ou tooltip quando so houver icone.

---

## 10. Responsividade

### 10.1 Breakpoints

Usar os breakpoints padrao do Tailwind.

Prioridades:

- Mobile funcional.
- Desktop refinado.
- Tabelas com scroll horizontal quando necessario.

### 10.2 Regras Mobile

- Header pode empilhar.
- Sidebar deve abrir como overlay.
- Cards ficam em coluna unica.
- Formularios devem ocupar largura total.
- Evitar grids de duas colunas em telas estreitas quando labels/inputs ficarem apertados.

---

## 11. Tokens CSS Propostos

Implementacao futura sugerida em `apps/web/src/styles.css`:

```css
:root {
  --fc-bg: #09090b;
  --fc-bg-soft: #0c0c0f;
  --fc-surface: rgba(24, 24, 27, 0.86);
  --fc-surface-muted: rgba(39, 39, 42, 0.54);
  --fc-border: rgba(255, 255, 255, 0.08);
  --fc-border-strong: rgba(255, 255, 255, 0.12);
  --fc-text: #f4f4f5;
  --fc-text-muted: #a1a1aa;
  --fc-text-subtle: #71717a;
  --fc-income: #34d399;
  --fc-expense: #fb7185;
  --fc-investment: #a78bfa;
  --fc-info: #60a5fa;
  --fc-warning: #fbbf24;
}
```

Classes globais sugeridas:

```css
.fc-shell {}
.fc-surface {}
.fc-field {}
.fc-button {}
.fc-button-primary {}
.fc-button-secondary {}
.fc-button-danger {}
.fc-button-investment {}
.fc-table-shell {}
.fc-table-head {}
.fc-pill {}
```

As classes atuais `deep-card`, `deep-input`, `deep-table-head` e `deep-tab-active` devem ser migradas gradualmente para a nomenclatura `fc-*`.

---

## 12. Migracao Recomendada

### Fase 1 - Fundacao

Objetivo:

- Criar tokens CSS globais.
- Manter compatibilidade com classes atuais.
- Evitar regressao visual.

Entregas:

- `:root` com tokens.
- `.fc-shell`
- `.fc-surface`
- `.fc-field`
- `.fc-button`
- Aliases temporarios para `deep-*`.

### Fase 2 - Componentes Base

Objetivo:

- Reduzir duplicacao visual.

Entregas:

- Botoes padronizados.
- Inputs padronizados.
- Cards padronizados.
- Pills padronizadas.
- Tabelas padronizadas.

### Fase 3 - Dashboard

Objetivo:

- Refinar a tela mais usada.

Entregas:

- Header reorganizado.
- Summary cards melhorados.
- Formulario de gasto refinado.
- Historico com tabela mais polida.

### Fase 4 - Abas Analiticas

Objetivo:

- Dar identidade propria para graficos, metas e investimentos.

Entregas:

- Charts com empty/loading states.
- Metas com progresso mais claro.
- Investimentos com composicao premium.

### Fase 5 - Modais e Estados

Objetivo:

- Fechar inconsistencias.

Entregas:

- Modais padronizados.
- Estados de erro/loading/empty.
- Foco e acessibilidade.

---

## 13. Roadmap Visual

### Task UI-001 - Tokens CSS

Objetivo:

- Criar tokens de identidade visual em `styles.css`.

Arquivos:

- `apps/web/src/styles.css`

Criterios:

- Tokens criados.
- Classes antigas continuam funcionando.
- App compila.

### Task UI-002 - Superficies e Cards

Objetivo:

- Migrar `deep-card` para `fc-surface`.

Arquivos:

- `styles.css`
- cards de summary
- charts
- metas
- investimentos
- modais

Criterios:

- Nenhum card visualmente azul/slate.
- Superficies consistentes.

### Task UI-003 - Inputs e Formularios

Objetivo:

- Padronizar inputs/selects/buttons de formulario.

Arquivos:

- expense form
- renda modal
- recurrence modal
- meta modal
- investments panel

Criterios:

- Todos os campos usam `fc-field`.
- Estados focus/disabled consistentes.

### Task UI-004 - Botoes

Objetivo:

- Criar e aplicar variantes de botoes.

Arquivos:

- header
- expense form
- modais
- investments panel
- dashboard actions

Criterios:

- Acoes primarias/secundarias/destrutivas padronizadas.
- Cores por contexto.

### Task UI-005 - Sidebar

Objetivo:

- Refinar navegacao lateral.

Arquivos:

- `sidebar.component.html`
- `sidebar.component.ts`

Criterios:

- Item ativo alinhado a identidade verde/neutra.
- Estado colapsado refinado.
- Mobile overlay preservado.

### Task UI-006 - Header Operacional

Objetivo:

- Reorganizar filtros e acoes globais.

Arquivos:

- `header.component.html`
- `header.component.ts`

Criterios:

- Periodo e acoes visualmente agrupados.
- Botoes menos coloridos e mais consistentes.

### Task UI-007 - Tabelas

Objetivo:

- Melhorar historico de gastos/rendas e historico de aportes.

Arquivos:

- `history-tabs.component.html`
- `investments-panel.component.html`

Criterios:

- Headers, rows, empty states e acoes consistentes.

### Task UI-008 - Investimentos Premium

Objetivo:

- Refinar a aba de investimentos como experiencia analitica premium.

Arquivos:

- `investments-panel.component.html`
- `investments-panel.component.ts`

Criterios:

- Grafico visualmente integrado.
- Cards de metricas refinados.
- Aporte manual e historico claros.

### Task UI-009 - Graficos e Metas

Objetivo:

- Refinar charts, legends, tooltips e progress bars.

Arquivos:

- `charts-panel.component.ts`
- `charts-panel.component.html`
- `metas.component.html`

Criterios:

- Paleta consistente.
- Empty states presentes.
- Progress bars padronizadas.

### Task UI-010 - Acessibilidade e Responsividade

Objetivo:

- Revisar foco, contraste e comportamento mobile.

Arquivos:

- todos os componentes visuais alterados.

Criterios:

- Sem texto sobreposto.
- Foco visivel.
- Layout funcional em mobile e desktop.

---

## 14. Criterios de Qualidade

Uma alteracao visual so deve ser considerada concluida quando:

- O app compila.
- Nao ha regressao funcional.
- A UI continua responsiva.
- Cores seguem a paleta oficial.
- Componentes usam tokens compartilhados quando possivel.
- Estados de loading/error/empty foram considerados.
- A tela preserva densidade operacional.
- O visual nao depende de classes duplicadas sem necessidade.

---

## 15. Decisao Final

A identidade visual do FinanceControl deve evoluir a partir do deep dark atual, nao substitui-lo.

O foco da evolucao deve ser consistencia, refinamento e maturidade visual. O produto deve parecer uma ferramenta financeira de uso real: sobria, rapida, confiavel e agradavel de usar todos os dias.
