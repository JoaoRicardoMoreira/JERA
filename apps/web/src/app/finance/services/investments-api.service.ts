import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/api/api-response.model';
import {
  InvestmentContributionResponse,
  InvestmentOverviewQuery,
  InvestmentOverviewResponse,
  UpsertInvestmentConfigRequest,
  UpsertInvestmentContributionRequest,
} from '../models/bff.models';

@Injectable({ providedIn: 'root' })
export class InvestmentsApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getOverview(query: InvestmentOverviewQuery): Observable<InvestmentOverviewResponse> {
    return this.http
      .get<ApiResponse<InvestmentOverviewResponse>>(`${this.apiBaseUrl}/investments/overview`, {
        params: this.toParams(query),
      })
      .pipe(map((response) => response.data));
  }

  updateConfig(request: UpsertInvestmentConfigRequest): Observable<InvestmentOverviewResponse> {
    return this.http
      .put<ApiResponse<InvestmentOverviewResponse>>(
        `${this.apiBaseUrl}/investments/config`,
        request,
      )
      .pipe(map((response) => response.data));
  }

  upsertContribution(
    request: UpsertInvestmentContributionRequest,
  ): Observable<InvestmentContributionResponse> {
    return this.http
      .put<ApiResponse<InvestmentContributionResponse>>(
        `${this.apiBaseUrl}/investments/contributions`,
        request,
      )
      .pipe(map((response) => response.data));
  }

  deleteContribution(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/investments/contributions/${id}`);
  }

  private toParams(query: InvestmentOverviewQuery): HttpParams {
    return new HttpParams().set('month', query.month).set('year', query.year);
  }
}
