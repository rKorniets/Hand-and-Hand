import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserNotification } from '../profile-user.model';

export interface NotificationResponse {
  data: UserNotification[];
  total: number;
}

export interface BatchPayload {
  count: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

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
