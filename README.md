# JERA FinanceControl

Aplicacao de controle financeiro com API NestJS, Prisma/PostgreSQL e frontend Next.js.

## Execucao local

1. Copie `.env.example` para `.env`.
2. Suba a API e o PostgreSQL com `docker compose up --build`.
3. Em outro terminal, execute `npm --prefix apps/web install` e
   `npm --prefix apps/web run dev`.

O frontend fica em `http://localhost:4200`, a API em
`http://localhost:3000/api/v1` e o Swagger em `http://localhost:3000/docs`.

## Deploy gratuito

A configuracao recomendada e:

- PostgreSQL no Neon;
- API no Render, usando o Blueprint `render.yaml` da raiz;
- frontend Next.js na Vercel, com `apps/web` como Root Directory.

### Variaveis da API no Render

O Blueprint preenche os valores nao sensiveis e gera os segredos JWT. Durante a
criacao do servico, informe apenas:

- `DATABASE_URL`: connection string do Neon;
- `CORS_ORIGINS`: URL publica do frontend na Vercel, sem barra final.

O comando de inicializacao executa `prisma migrate deploy` antes de iniciar a API.
O endpoint publico de verificacao e `/api/v1/health`.

### Variavel do frontend na Vercel

Configure `NEXT_PUBLIC_API_BASE_URL` com a URL publica do Render seguida de
`/api/v1`, por exemplo `https://jera-api.onrender.com/api/v1`.

Nunca envie arquivos `.env`, senhas, tokens JWT ou connection strings para o Git.
