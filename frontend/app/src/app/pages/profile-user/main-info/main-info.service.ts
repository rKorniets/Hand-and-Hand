import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppUser } from '../profile-user.model';
import { API_BASE_URL } from '../../../tokens';

@Injectable({ providedIn: 'root' })
export class MainInfoService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  uploadAvatar(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<AppUser>(`${this.apiUrl}/app-users/me/avatar`, formData).pipe(
      map((updatedUser) => {
        if (!updatedUser.avatar_url) {
          throw new Error('Сервер не повернув avatar_url');
        }
        return updatedUser.avatar_url;
      }),
    );
  }

  deleteAvatar(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/app-users/me/avatar`);
  }
}
