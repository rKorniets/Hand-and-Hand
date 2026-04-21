import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export type CategoryContext = 'news' | 'tasks' | 'organizations' | 'fundraising';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = '/api/categories';
  private readonly locationsUrl = '/api/locations';

  private cache: Partial<Record<CategoryContext, Observable<Category[]>>> = {};
  private cities$: Observable<string[]> | null = null;

  constructor(private http: HttpClient) {}

  getByContext(context: CategoryContext): Observable<Category[]> {
    if (!this.cache[context]) {
      this.cache[context] = this.http
        .get<Category[]>(`${this.apiUrl}?for=${context}`)
        .pipe(shareReplay(1));
    }
    return this.cache[context]!;
  }

  getCities(): Observable<string[]> {
    if (!this.cities$) {
      this.cities$ = this.http.get<string[]>(`${this.locationsUrl}/cities`).pipe(shareReplay(1));
    }
    return this.cities$;
  }

  clearCache(): void {
    this.cache = {};
    this.cities$ = null;
  }
}
