import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Project, CreateProjectPayload, Category } from './events-constructor.model';
import { API_BASE_URL } from '../../../tokens';

@Injectable({ providedIn: 'root' })
export class EventsConstructorService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createProject(payload: CreateProjectPayload): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, payload, {
      headers: this.getHeaders(),
    });
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateProject(id: number, payload: CreateProjectPayload): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, payload, {
      headers: this.getHeaders(),
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, {
      headers: this.getHeaders(),
    });
  }
}
