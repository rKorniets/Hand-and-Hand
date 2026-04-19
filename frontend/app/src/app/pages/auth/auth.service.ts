import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface AuthResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/auth';
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('access_token'));

  get isLoggedIn$() {
    return this.loggedIn$.asObservable();
  }

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
    this.loggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getMe() {
    return this.http.get(`${this.API}/me`);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = jwtDecode<{ role: string }>(token);
      return payload.role;
    } catch {
      return null;
    }
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<{ sub: number }>(token).sub;
    } catch {
      return null;
    }
  }

  resetPassword(email: string) {
    return this.http.post(`${this.API}/forgot-password`, { email });
  }

  confirmResetPassword(token: string, password: string) {
    return this.http.post(`${this.API}/reset-password`, { token, password });
  }

  private saveToken(token: string) {
    localStorage.setItem('access_token', token);
    this.loggedIn$.next(true);
  }
}
