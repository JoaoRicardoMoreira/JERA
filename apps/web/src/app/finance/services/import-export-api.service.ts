import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/api/api-response.model';
import { ExportCsvQuery, ImportCsvResponse } from '../models/bff.models';

@Injectable({ providedIn: 'root' })
export class ImportExportApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  exportCsv(query: ExportCsvQuery): Observable<Blob> {
    return this.http.get(`${this.apiBaseUrl}/import-export/csv/export`, {
      params: this.toParams(query),
      responseType: 'blob',
    });
  }

  importCsv(file: File): Observable<ImportCsvResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiResponse<ImportCsvResponse>>(`${this.apiBaseUrl}/import-export/csv/import`, formData)
      .pipe(map((response) => response.data));
  }

  private toParams(query: ExportCsvQuery): HttpParams {
    let params = new HttpParams();

    if (query.month) {
      params = params.set('month', query.month);
    }

    if (query.year) {
      params = params.set('year', query.year);
    }

    if (query.type) {
      params = params.set('type', query.type);
    }

    return params;
  }
}
