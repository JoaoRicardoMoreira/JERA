import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { ApiResponse } from '../interfaces/api-response.interface';
import { RequestWithContext } from '../middlewares/request-context.middleware';

@Injectable()
export class ResponseInterceptor<TData> implements NestInterceptor<
  TData,
  ApiResponse<TData | null>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<TData>,
  ): Observable<ApiResponse<TData | null>> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data ?? null,
        meta: {
          requestId: request.requestId,
        },
      })),
    );
  }
}
