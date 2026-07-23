import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

import { ERROR_CODES, ErrorCode } from '../constants/error-codes';

interface PrismaErrorMapping {
  statusCode: HttpStatus;
  error: string;
  message: string;
  code: ErrorCode;
}

interface ErrorResponseBody extends PrismaErrorMapping {
  success: false;
  details: unknown[];
  path: string;
  timestamp: string;
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter<Prisma.PrismaClientKnownRequestError> {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const errorMapping = this.mapPrismaError(exception);

    const body: ErrorResponseBody = {
      success: false,
      ...errorMapping,
      details: [],
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };

    response.status(errorMapping.statusCode).json(body);
  }

  private mapPrismaError(exception: Prisma.PrismaClientKnownRequestError): PrismaErrorMapping {
    switch (exception.code) {
      case 'P2002':
        return {
          statusCode: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: 'Recurso ja existente.',
          code: ERROR_CODES.CONFLICT,
        };
      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: 'Recurso nao encontrado.',
          code: ERROR_CODES.NOT_FOUND,
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Database Error',
          message: 'Erro ao processar dados.',
          code: ERROR_CODES.DATABASE_ERROR,
        };
    }
  }
}
