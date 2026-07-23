import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/api/api-response.model';
import { ChartsResponse, DashboardQuery, MonthlySummaryResponse } from '../models/bff.models';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getMonthlySummary(query: DashboardQuery): Observable<MonthlySummaryResponse> {
    return this.http
      .get<ApiResponse<MonthlySummaryResponse>>(`${this.apiBaseUrl}/dashboard/monthly-summary`, {
        params: this.toParams(query),
      })
      .pipe(map((response) => response.data));
  }

  getCharts(query: DashboardQuery): Observable<ChartsResponse> {
    return this.http
      .get<ApiResponse<ChartsResponse>>(`${this.apiBaseUrl}/dashboard/charts`, {
        params: this.toParams(query),
      })
      .pipe(map((response) => response.data));
  }

  private toParams(query: DashboardQuery): HttpParams {
    return new HttpParams().set('month', query.month).set('year', query.year);
  }
}
