import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, map, shareReplay, switchMap, take, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let refresh$: Observable<string> | null = null;

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
  if (!refresh$) {
    refresh$ = auth.refresh().pipe(
      map((res) => res.accessToken),
      tap({
        complete: () => {
          refresh$ = null;
        },
      }),
      catchError((refreshErr) => {
        refresh$ = null;
        auth.handleAuthFailure();
        return throwError(() => refreshErr);
      }),
      shareReplay(1),
    );
  }

  return refresh$.pipe(
    take(1),
    switchMap((newToken) => {
      const retryReq = req.clone({
        setHeaders: { Authorization: `Bearer ${newToken}` },
      });
      return next(retryReq);
    }),
  );
}
