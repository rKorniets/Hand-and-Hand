import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  registerUser(data: {
    firstName: string; lastName: string;
    city: string; email: string; password: string;
  }) {
    return this.http.post(`${this.API}/register/user`, data);
  }

  registerOrganization(data: {
    name: string; edrpou: string;
    email: string; password: string;
  }) {
    return this.http.post(`${this.API}/register/organization`, data);
  }

  loginUser(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API}/login/user`, data).pipe(
      tap(res => this.saveToken(res.accessToken))
    );
  }

  loginOrganization(data: { edrpou: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API}/login/organization`, data).pipe(
      tap(res => this.saveToken(res.accessToken))
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private saveToken(token: string) {
    localStorage.setItem('access_token', token);
    this.router.navigate(['/']);
  }
}
