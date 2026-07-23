export interface ApiErrorViewModel {
  statusCode: number;
  code: string;
  message: string;
  path?: string;
}

type ApiErrorBody = {
  statusCode?: number;
  code?: string;
  message?: string | string[];
  path?: string;
};

export class ApiClientError extends Error {
  constructor(readonly details: ApiErrorViewModel) {
    super(details.message);
  }
}

export function normalizeApiError(error: unknown): ApiErrorViewModel {
  if (error instanceof ApiClientError) {
    return error.details;
  }

  if (error instanceof Error) {
    return {
      statusCode: 0,
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Nao foi possivel concluir a operacao.',
    };
  }

  return {
    statusCode: 0,
    code: 'UNKNOWN_ERROR',
    message: 'Nao foi possivel concluir a operacao.',
  };
}

export function toApiClientError(statusCode: number, body: ApiErrorBody | null) {
  const message = Array.isArray(body?.message)
    ? body?.message.join(', ')
    : body?.message || defaultMessage(statusCode);

  return new ApiClientError({
    statusCode,
    code: body?.code ?? defaultCode(statusCode),
    message,
    path: body?.path,
  });
}

function defaultCode(statusCode: number) {
  if (statusCode === 401) return 'AUTHENTICATION_REQUIRED';
  if (statusCode === 403) return 'FORBIDDEN';
  if (statusCode >= 500) return 'SERVER_ERROR';
  return 'REQUEST_ERROR';
}

function defaultMessage(statusCode: number) {
  if (statusCode === 401) return 'Sessao expirada. Entre novamente.';
  if (statusCode === 403) return 'Voce nao tem permissao para executar esta acao.';
  if (statusCode >= 500) return 'Nao foi possivel falar com o servidor.';
  return 'Verifique os dados e tente novamente.';
}
