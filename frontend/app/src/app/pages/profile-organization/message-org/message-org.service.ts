import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  OrgNotification,
} from '../profile-organization.model';
import { API_BASE_URL } from '../../../tokens';

export interface NotificationResponse {
  data: OrgNotification[];
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
    return this.http.get<NotificationResponse>(`${this.apiUrl}/notifications/org`);
  }

  markAsRead(id: number): Observable<OrgNotification> {
    return this.http.patch<OrgNotification>(`${this.apiUrl}/notifications/org/${id}/read`, {});
  }

  markAllAsRead(): Observable<BatchPayload> {
    return this.http.patch<BatchPayload>(`${this.apiUrl}/notifications/read-all`, {});
  }

  delete(id: number): Observable<OrgNotification> {
    return this.http.delete<OrgNotification>(`${this.apiUrl}/notifications/org/${id}`);
  }
}
