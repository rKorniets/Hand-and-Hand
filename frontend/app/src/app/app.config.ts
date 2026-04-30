import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { routes } from './app.routes';
import { authInterceptor } from './pages/auth/auth.interceptor';
import { API_BASE_URL } from './tokens';
import { environment } from '../environments/environment';

registerLocaleData(localeUk);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'uk' },
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
  ],
};
