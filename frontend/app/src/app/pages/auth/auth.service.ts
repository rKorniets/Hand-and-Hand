import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../../tokens';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(ACCESS_TOKEN_KEY));

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
      .pipe(tap((res) => this.saveTokens(res.accessToken, res.refreshToken)));
  }

  loginOrganization(data: { code: string; password: string }) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login/organization`, data)
      .pipe(tap((res) => this.saveTokens(res.accessToken, res.refreshToken)));
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

  refresh(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((res) => this.saveTokens(res.accessToken, res.refreshToken)),
      catchError((err) => {
        this.clearTokens();
        return throwError(() => err);
      }),
    );
  }

  logout() {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http
        .post(`${this.apiUrl}/auth/logout`, { refreshToken })
        .subscribe({ next: () => {}, error: () => {} });
    }
    this.clearTokens();
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
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

  private saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this.loggedIn$.next(true);
  }

  private clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.loggedIn$.next(false);
  }
}
