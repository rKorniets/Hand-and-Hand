import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserNotification } from '../profile-user.model';
import { API_BASE_URL } from '../../../tokens';

export interface NotificationResponse {
  data: UserNotification[];
  total: number;
}

export interface BatchPayload {
  count: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  getMyNotifications(): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.apiUrl}/notifications`);
  }

  markAsRead(id: number): Observable<UserNotification> {
    return this.http.patch<UserNotification>(`${this.apiUrl}/notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<BatchPayload> {
    return this.http.patch<BatchPayload>(`${this.apiUrl}/notifications/read-all`, {});
  }

  delete(id: number): Observable<UserNotification> {
    return this.http.delete<UserNotification>(`${this.apiUrl}/notifications/${id}`);
  }
}
