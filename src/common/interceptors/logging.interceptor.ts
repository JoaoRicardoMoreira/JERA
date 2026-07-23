import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { RequestUser } from '../interfaces/request-user.interface';
import { RequestWithContext } from '../middlewares/request-context.middleware';

interface AuthenticatedRequest extends RequestWithContext {
  path?: string;
  user?: RequestUser;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<AuthenticatedRequest>();
    const response = httpContext.getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logRequest(request, response.statusCode, Date.now() - startedAt);
      }),
      catchError((error: unknown) => {
        const statusCode = this.getErrorStatusCode(error, response.statusCode);
        this.logRequest(request, statusCode, Date.now() - startedAt);

        return throwError(() => error);
      }),
    );
  }

  private logRequest(request: AuthenticatedRequest, statusCode: number, durationMs: number): void {
    const userId = request.user?.id ?? 'anonymous';
    const path = request.path ?? request.url?.split('?')[0] ?? 'unknown';

    this.logger.log(
      `requestId=${request.requestId} method=${request.method} path=${path} status=${statusCode} durationMs=${durationMs} userId=${userId}`,
    );
  }

  private getErrorStatusCode(error: unknown, fallbackStatusCode: number): number {
    if (
      typeof error === 'object' &&
      error !== null &&
      'getStatus' in error &&
      typeof error.getStatus === 'function'
    ) {
      return error.getStatus() as number;
    }

    return fallbackStatusCode >= 400 ? fallbackStatusCode : 500;
  }
}
