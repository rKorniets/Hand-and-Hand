import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

const PUBLIC_AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/resend-verification',
];

const isPublicAuthUrl = (url: string) => PUBLIC_AUTH_PATHS.some((p) => url.includes(p));

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (isPublicAuthUrl(req.url)) {
    return next(req);
  }

  const token = auth.getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return handle401(req, next, auth);
      }
      return throwError(() => err);
    }),
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  auth: AuthService,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);

    return auth.refresh().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshSubject.next(res.accessToken);
        const retryReq = req.clone({
          setHeaders: { Authorization: `Bearer ${res.accessToken}` },
        });
        return next(retryReq);
      }),
      catchError((refreshErr) => {
        isRefreshing = false;
        refreshSubject.next(null);
        auth.logout();
        return throwError(() => refreshErr);
      }),
    );
  }

  return refreshSubject.pipe(
    filter((t): t is string => t !== null),
    take(1),
    switchMap((newToken) => {
      const retryReq = req.clone({
        setHeaders: { Authorization: `Bearer ${newToken}` },
      });
      return next(retryReq);
    }),
  );
}
