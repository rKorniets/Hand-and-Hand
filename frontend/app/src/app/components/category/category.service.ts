import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { API_BASE_URL } from '../../tokens';
import { CategoryContext, Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl: string;
  private readonly locationsUrl: string;

  private cache: Partial<Record<CategoryContext, Observable<Category[]>>> = {};
  private cities$: Observable<string[]> | null = null;

  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) baseUrl: string,
  ) {
    this.apiUrl = `${baseUrl}/categories`;
    this.locationsUrl = `${baseUrl}/locations`;
  }

  getByContext(context: CategoryContext): Observable<Category[]> {
    if (!this.cache[context]) {
      this.cache[context] = this.http
        .get<Category[]>(`${this.apiUrl}?for=${context}`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.cache[context]!;
  }

  getCities(): Observable<string[]> {
    if (!this.cities$) {
      this.cities$ = this.http
        .get<string[]>(`${this.locationsUrl}/cities`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.cities$;
  }

  clearCache(): void {
    this.cache = {};
    this.cities$ = null;
  }
}
