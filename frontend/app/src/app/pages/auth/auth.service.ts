import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../../tokens';

export interface AuthResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('access_token'));

  get isLoggedIn$() {
    return this.loggedIn$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  registerUser(data: {
    firstName: string;
    lastName: string;
    city: string;
    email: string;
    password: string;
  }) {
    return this.http.post(`${this.apiUrl}/auth/register/user`, data);
  }

  registerOrganization(data: {
    name: string;
    edrpou: string;
    city: string;
    address: string;
    email: string;
    password: string;
  }) {
    return this.http.post(`${this.apiUrl}/auth/register/organization`, data);
  }

  loginUser(data: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login/user`, data)
      .pipe(tap((res) => this.saveToken(res.accessToken)));
  }

  loginOrganization(data: { code: string; password: string }) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login/organization`, data)
      .pipe(tap((res) => this.saveToken(res.accessToken)));
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(userId: string, token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      userId: Number(userId),
      token,
      newPassword,
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.loggedIn$.next(false);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getMe() {
    return this.http.get(`${this.apiUrl}/auth/me`);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<{ role: string }>(token).role;
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

  private saveToken(token: string) {
    localStorage.setItem('access_token', token);
    this.loggedIn$.next(true);
  }
}
