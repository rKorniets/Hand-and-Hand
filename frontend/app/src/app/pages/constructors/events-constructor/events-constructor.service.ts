import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Project, CreateProjectPayload, Category } from './events-constructor.model';

@Injectable({ providedIn: 'root' })
export class EventsConstructorService {
  private readonly apiUrl = 'http://localhost:3000/projects';
  private readonly categoriesUrl = 'http://localhost:3000/categories';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createProject(payload: CreateProjectPayload): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, payload, {
      headers: this.getHeaders(),
    });
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateProject(id: number, payload: CreateProjectPayload): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, payload, {
      headers: this.getHeaders(),
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl, {
      headers: this.getHeaders(),
    });
  }
}
