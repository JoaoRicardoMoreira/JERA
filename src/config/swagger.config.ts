import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  enabled: process.env.SWAGGER_ENABLED === 'true',
  path: process.env.SWAGGER_PATH,
  title: 'FinanceControl BFF API',
  description:
    'API Backend for Frontend da aplicacao FinanceControl. Endpoints especializados para autenticacao, dashboard, transacoes, metas, recorrencias, categorias e importacao/exportacao CSV.',
  version: '0.1.0',
  bearerAuthName: 'bearer',
}));
