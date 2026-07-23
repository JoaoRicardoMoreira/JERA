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

export interface ApiErrorViewModel {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown[];
}
