import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/api/api-response.model';
import {
  CreateRecurrenceRequest,
  ProcessRecurrencesRequest,
  ProcessRecurrencesResponse,
  RecurrenceResponse,
} from '../models/bff.models';

@Injectable({ providedIn: 'root' })
export class RecurrencesApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  createRecurrence(request: CreateRecurrenceRequest): Observable<RecurrenceResponse> {
    return this.http
      .post<ApiResponse<RecurrenceResponse>>(`${this.apiBaseUrl}/recurrences`, request)
      .pipe(map((response) => response.data));
  }

  listRecurrences(): Observable<RecurrenceResponse[]> {
    return this.http
      .get<ApiResponse<RecurrenceResponse[]>>(`${this.apiBaseUrl}/recurrences`)
      .pipe(map((response) => response.data));
  }

  processRecurrences(request: ProcessRecurrencesRequest): Observable<ProcessRecurrencesResponse> {
    return this.http
      .post<ApiResponse<ProcessRecurrencesResponse>>(
        `${this.apiBaseUrl}/recurrences/process`,
        request,
      )
      .pipe(map((response) => response.data));
  }

  deleteRecurrence(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/recurrences/${id}`);
  }
}
