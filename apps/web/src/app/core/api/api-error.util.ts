import { HttpErrorResponse } from '@angular/common/http';

import { ApiErrorResponse, ApiErrorViewModel } from './api-error.model';

const NETWORK_ERROR: ApiErrorViewModel = {
  statusCode: 0,
  code: 'NETWORK_ERROR',
  message: 'Nao foi possivel conectar ao servidor.',
};

const FRIENDLY_MESSAGES: Record<number, string> = {
  401: 'Sua sessao expirou. Entre novamente.',
  403: 'Voce nao tem permissao para executar esta acao.',
  422: 'Confira os dados informados e tente novamente.',
  429: 'Muitas tentativas em pouco tempo. Aguarde e tente novamente.',
};

export function normalizeApiError(error: unknown): ApiErrorViewModel {
  if (!(error instanceof HttpErrorResponse)) {
    return {
      statusCode: 0,
      code: 'UNKNOWN_ERROR',
      message: 'Erro inesperado na aplicacao.',
      details: [error],
    };
  }

  if (!error.error) {
    return NETWORK_ERROR;
  }

  const apiError = error.error as Partial<ApiErrorResponse>;
  const rawMessage = Array.isArray(apiError.message)
    ? apiError.message.join(', ')
    : apiError.message || error.message || NETWORK_ERROR.message;
  const statusCode = apiError.statusCode ?? error.status;

  return {
    statusCode,
    code: apiError.code ?? 'HTTP_ERROR',
    message: FRIENDLY_MESSAGES[statusCode] ?? rawMessage,
    details: apiError.details,
  };
}
