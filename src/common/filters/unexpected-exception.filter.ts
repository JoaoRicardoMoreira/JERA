import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { ERROR_CODES } from '../constants/error-codes';

interface ErrorResponseBody {
  success: false;
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR;
  error: string;
  message: string;
  code: typeof ERROR_CODES.INTERNAL_SERVER_ERROR;
  details: unknown[];
  path: string;
  timestamp: string;
}

@Catch()
export class UnexpectedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnexpectedExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const isProduction = this.configService.get<string>('app.nodeEnv') === 'production';

    const errorTrace = !isProduction && exception instanceof Error ? exception.stack : undefined;

    this.logger.error(`Unexpected error on ${request.method} ${request.originalUrl}`, errorTrace);

    const body: ErrorResponseBody = {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Erro interno do servidor.',
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      details: isProduction ? [] : this.getNonProductionDetails(exception),
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }

  private getNonProductionDetails(exception: unknown): unknown[] {
    if (exception instanceof Error) {
      return [
        {
          name: exception.name,
          message: exception.message,
          stack: exception.stack,
        },
      ];
    }

    return [
      {
        message: String(exception),
      },
    ];
  }
}
