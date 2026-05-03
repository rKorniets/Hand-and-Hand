import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Category, CreateTicketPayload, Ticket } from './request-constructor.model';
import { API_BASE_URL } from '../../../tokens';

@Injectable({ providedIn: 'root' })
export class RequestConstructorService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createTicket(payload: CreateTicketPayload): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, payload, {
      headers: this.getHeaders(),
    });
  }

  getMyProfile() {
    return this.http.get<{ location: { city: string; address: string; region: string } | null }>(
      `${this.apiUrl}/app-users/me`,
      { headers: this.getHeaders() },
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories?for=tickets`);
  }
}
