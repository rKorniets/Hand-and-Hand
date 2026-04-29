import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CreateRequestPayload, Request, Category } from './request-constructor.model';

@Injectable({ providedIn: 'root' })
export class RequestConstructorService {
  private readonly apiUrl = 'http://localhost:3000/requests';
  private readonly categoriesUrl = 'http://localhost:3000/categories';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createRequest(payload: CreateRequestPayload): Observable<Request> {
    return this.http.post<Request>(this.apiUrl, payload, {
      headers: this.getHeaders(),
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl, {
      headers: this.getHeaders(),
    });
  }
  getMyProfile() {
    return this.http.get<{ location: { city: string; address: string; region: string } | null }>(
      '/api/users/me',
    );
  }
}
