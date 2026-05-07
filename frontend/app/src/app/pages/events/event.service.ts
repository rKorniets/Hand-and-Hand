import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewEvent, ProjectRegistration } from './event.model';
import { API_BASE_URL } from '../../tokens';

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

  getEvents(limit = 5, skip = 0, status?: string): Observable<PaginatedEvents> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);

    if (status !== undefined) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedEvents>(`${this.apiUrl}/projects`, { params });
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
