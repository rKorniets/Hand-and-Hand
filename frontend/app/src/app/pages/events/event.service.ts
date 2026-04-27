import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewEvent, ProjectRegistration } from './event.model';

export interface PaginatedEvents {
  data: NewEvent[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly apiUrl = 'http://localhost:3000/projects';

  constructor(private http: HttpClient) {}

  getEvents(limit = 5, skip = 0, status?: string): Observable<PaginatedEvents> {
    let params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip);

    if (status !== undefined) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedEvents>(this.apiUrl, { params });
  }

  getEventById(id: number): Observable<NewEvent> {
    const params = new HttpParams().set('t', Date.now().toString());
    return this.http.get<NewEvent>(`${this.apiUrl}/${id}`, { params });
  }
  register(projectId: number): Observable<ProjectRegistration> {
    return this.http.post<ProjectRegistration>(
      `${this.apiUrl}/${projectId}/register`, {}
    );
  }

  unregister(projectId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${projectId}/register`
    );
  }

  getMyRegistration(projectId: number): Observable<ProjectRegistration | null> {
    return this.http.get<ProjectRegistration | null>(
      `${this.apiUrl}/${projectId}/my-registration`
    );
  }
}
