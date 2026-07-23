import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { ERROR_CODES, ErrorCode } from '../constants/error-codes';

type HttpExceptionResponse =
  | string
  | {
      error?: string;
      message?: string | string[];
      statusCode?: number;
      code?: ErrorCode;
      details?: unknown;
    };

interface ErrorResponseBody {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  code: ErrorCode;
  details: unknown[];
  path: string;
  timestamp: string;
}

const HTTP_STATUS_ERROR_CODES: Partial<Record<HttpStatus, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: ERROR_CODES.VALIDATION_ERROR,
  [HttpStatus.UNAUTHORIZED]: ERROR_CODES.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ERROR_CODES.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ERROR_CODES.NOT_FOUND,
  [HttpStatus.CONFLICT]: ERROR_CODES.CONFLICT,
  [HttpStatus.UNPROCESSABLE_ENTITY]: ERROR_CODES.UNPROCESSABLE_ENTITY,
  [HttpStatus.TOO_MANY_REQUESTS]: ERROR_CODES.RATE_LIMIT_EXCEEDED,
  [HttpStatus.INTERNAL_SERVER_ERROR]: ERROR_CODES.INTERNAL_SERVER_ERROR,
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as HttpExceptionResponse;
    const normalizedResponse = this.normalizeExceptionResponse(exceptionResponse);

    const body: ErrorResponseBody = {
      success: false,
      statusCode,
      error: normalizedResponse.error ?? this.getDefaultError(statusCode),
      message: normalizedResponse.message ?? exception.message,
      code: normalizedResponse.code ?? this.getErrorCode(statusCode),
      details: this.normalizeDetails(normalizedResponse.details),
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }

  private normalizeExceptionResponse(response: HttpExceptionResponse): {
    error?: string;
    message?: string | string[];
    code?: ErrorCode;
    details?: unknown;
  } {
    if (typeof response === 'string') {
      return {
        message: response,
      };
    }

    return {
      error: response.error,
      message: response.message,
      code: response.code,
      details: response.details,
    };
  }

  private getErrorCode(statusCode: HttpStatus): ErrorCode {
    return HTTP_STATUS_ERROR_CODES[statusCode] ?? ERROR_CODES.INTERNAL_SERVER_ERROR;
  }

  private getDefaultError(statusCode: number): string {
    return HttpStatus[statusCode] ?? 'Error';
  }

  private normalizeDetails(details: unknown): unknown[] {
    if (!details) {
      return [];
    }

    return Array.isArray(details) ? details : [details];
  }
}
