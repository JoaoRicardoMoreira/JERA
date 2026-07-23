export interface ApiResponseMeta {
  requestId?: string;
  pagination?: unknown;
}

export interface ApiResponse<TData = unknown> {
  success: true;
  data: TData;
  meta?: ApiResponseMeta;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  code: string;
  details?: unknown[];
  path: string;
  timestamp: string;
}
