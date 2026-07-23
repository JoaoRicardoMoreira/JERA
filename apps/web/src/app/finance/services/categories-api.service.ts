import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/api/api-response.model';
import { CategoryResponse } from '../models/bff.models';

@Injectable({ providedIn: 'root' })
export class CategoriesApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  listCategories(): Observable<CategoryResponse[]> {
    return this.http
      .get<ApiResponse<CategoryResponse[]>>(`${this.apiBaseUrl}/categories`)
      .pipe(map((response) => response.data));
  }
}
