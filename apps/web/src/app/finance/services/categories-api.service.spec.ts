import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { CategoriesApiService } from './categories-api.service';

describe('CategoriesApiService', () => {
  let service: CategoriesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CategoriesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lists categories from the BFF', () => {
    const expected = [
      {
        id: 'cat-1',
        name: 'Moradia',
        type: 'EXPENSE' as const,
        createdAt: '2026-07-03T12:00:00.000Z',
        updatedAt: '2026-07-03T12:00:00.000Z',
      },
    ];

    service.listCategories().subscribe((categories) => {
      expect(categories).toEqual(expected);
    });

    const request = httpMock.expectOne(`${environment.apiBaseUrl}/categories`);
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: expected });
  });
});
