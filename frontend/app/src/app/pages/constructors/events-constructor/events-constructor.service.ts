import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { project_status_enum } from './events-constructor.model';
import { AuthService } from '../../auth/auth.service';

export interface CreateProjectPayload {
  organization_profile_id: number;
  title: string;
  description: string;
  main_content?: string;
  status?: project_status_enum;
  starts_at?: string;
  ends_at?: string;
  time?: string;
  application_deadline?: string;
  what_volunteers_will_do?: string;
  why_its_important?: string;
  partners?: string;
  image_url?: string;
  category_id?: number;
  location?: {
    city: string;
    address: string;
    region: string;
  };
}

export interface Project {
  id: number;
  organization_profile_id: number;
  title: string;
  description: string;
  main_content: string | null;
  status: project_status_enum;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class EventsConstructorService {
  private readonly apiUrl = 'http://localhost:3000/projects';

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

  getCategories(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>('http://localhost:3000/categories', {
      headers: this.getHeaders(),
    });
  }
}
