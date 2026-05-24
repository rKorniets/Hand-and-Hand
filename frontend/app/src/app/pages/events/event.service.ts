import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { NewEvent, ProjectRegistration } from './event.model';
import { API_BASE_URL } from '../../tokens';
import { FilterState } from '../../components/category/category.model';

export interface PaginatedEvents {
  data: NewEvent[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  getEvents(limit = 5, skip = 0, filters?: FilterState): Observable<PaginatedEvents> {
    let params = new HttpParams().set('limit', limit.toString()).set('skip', skip.toString());

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.city) params = params.set('city', filters.city);
    if (filters?.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters?.status?.length) {
      filters.status.forEach((s) => {
        params = params.append('status', s);
      });
    }
    if (filters?.categories?.length) {
      filters.categories.forEach((slug) => {
        params = params.append('categories', slug);
      });
    }

    return this.http.get<PaginatedEvents>(`${this.apiUrl}/projects`, { params });
  }

  getAllEventsForMap(filters?: FilterState): Observable<NewEvent[]> {
    return this.getEvents(100, 0, filters).pipe(map((r) => r.data));
  }

  getEventById(id: number): Observable<NewEvent> {
    const params = new HttpParams().set('t', Date.now().toString());
    return this.http.get<NewEvent>(`${this.apiUrl}/projects/${id}`, { params });
  }

  register(projectId: number): Observable<ProjectRegistration> {
    return this.http.post<ProjectRegistration>(`${this.apiUrl}/projects/${projectId}/register`, {});
  }

  unregister(projectId: number): Observable<ProjectRegistration> {
    return this.http.delete<ProjectRegistration>(`${this.apiUrl}/projects/${projectId}/register`);
  }

  getMyRegistration(projectId: number): Observable<ProjectRegistration | null> {
    return this.http.get<ProjectRegistration | null>(
      `${this.apiUrl}/projects/${projectId}/my-registration`,
    );
  }
}
