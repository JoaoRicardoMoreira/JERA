# FinanceControl Monorepo Runbook

## Estrutura

- Backend BFF NestJS: raiz do repositorio.
- Frontend Angular integrado: `apps/web`.
- Frontend legado original: `C:\Users\joao\Documents\projetos\FinanceControl\FinanceControlFront`.

O frontend legado deve permanecer intacto. Durante o desenvolvimento integrado, altere apenas a copia em `apps/web`.

## Portas

- API BFF: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/docs`
- Angular dev server: `http://localhost:4200`
- PostgreSQL via Docker Compose: conforme `.env` e `docker-compose.yml`

## Variaveis

Backend:

- Use o `.env` da raiz do projeto.
- Garanta `DATABASE_URL`, JWT secrets, expiracoes de token, CORS e porta da API conforme a spec do backend.

Frontend:

- Desenvolvimento: `apps/web/src/environments/environment.development.ts`
- Producao: `apps/web/src/environments/environment.production.ts`
- A URL local padrao do BFF e `http://localhost:3000/api/v1`.

## Comandos

Instalar dependencias do frontend:

```bash
npm --prefix apps/web install
```

Rodar backend:

```bash
npm run dev:api
```

Rodar frontend:

```bash
npm run dev:web
```

Gerar Prisma Client:

```bash
npm run prisma:generate
```

Aplicar migrations:

```bash
npm run prisma:migrate
```

Executar seed:

```bash
npm run prisma:seed
```

Validar TypeScript do frontend:

```bash
npx tsc -p apps/web/tsconfig.app.json --noEmit
```

Validar TypeScript dos specs do frontend:

```bash
npx tsc -p apps/web/tsconfig.spec.json --noEmit
```

Build do frontend:

```bash
npm run web:build
```

Testes do frontend:

```bash
npm run web:test -- --watch=false --browsers=ChromeHeadless
```

## Fluxo De Validacao Local

1. Subir PostgreSQL pelo Docker Compose.
2. Rodar migrations e seed do backend.
3. Iniciar o BFF com `npm run dev:api`.
4. Iniciar o Angular com `npm run dev:web`.
5. Abrir `http://localhost:4200`.
6. Registrar um usuario.
7. Fazer login e logout.
8. Criar receita e despesa.
9. Conferir historico, cards e graficos.
10. Criar/alterar meta por categoria.
11. Criar, processar e excluir recorrencia.
12. Exportar e importar CSV.
13. Recarregar a pagina e confirmar persistencia pelo BFF.

## Observacoes Do Sandbox

No ambiente atual do Codex, `tsc` do frontend passou para app e specs. O `ng build` foi bloqueado por permissao de leitura em diretorios acima da workspace, e o Karma nao conseguiu iniciar o Chrome por erro de GPU/processo. Essas falhas dependem do ambiente; valide `npm run web:build` e `npm run web:test` em um terminal local normal.
