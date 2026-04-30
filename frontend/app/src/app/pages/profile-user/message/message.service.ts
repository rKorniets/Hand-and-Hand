import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../profile-user.model';

export interface NotificationResponse {
  data: Notification[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.apiUrl}/notifications`);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/notifications/read-all`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notifications/${id}`);
  }
}
