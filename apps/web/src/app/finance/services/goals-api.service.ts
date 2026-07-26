import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/api/api-response.model';
import { DashboardQuery, GoalResponse, UpsertGoalRequest } from '../models/bff.models';

@Injectable({ providedIn: 'root' })
export class GoalsApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  listGoals(query: DashboardQuery): Observable<GoalResponse[]> {
    return this.http
      .get<ApiResponse<GoalResponse[]>>(`${this.apiBaseUrl}/budgets`, {
        params: new HttpParams().set('month', query.month).set('year', query.year),
      })
      .pipe(map((response) => response.data));
  }

  upsertGoal(request: UpsertGoalRequest): Observable<GoalResponse> {
    return this.http
      .put<ApiResponse<GoalResponse>>(`${this.apiBaseUrl}/budgets`, request)
      .pipe(map((response) => response.data));
  }
}
