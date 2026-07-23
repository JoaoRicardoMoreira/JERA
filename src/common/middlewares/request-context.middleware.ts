import { randomUUID } from 'node:crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { APP_CONSTANTS } from '../constants/app.constants';

export interface RequestWithContext {
  method: string;
  originalUrl?: string;
  url: string;
  header(name: string): string | undefined;
  requestId: string;
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: RequestWithContext, response: Response, next: NextFunction): void {
    const incomingRequestId = request.header(APP_CONSTANTS.REQUEST_ID_HEADER);
    const requestId = incomingRequestId?.trim() || randomUUID();

    request.requestId = requestId;
    response.setHeader(APP_CONSTANTS.REQUEST_ID_HEADER, requestId);

    next();
  }
}
