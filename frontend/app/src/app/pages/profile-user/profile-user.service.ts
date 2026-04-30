import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ITicket, ActivityItem, FundraisingCampaign, Reward, AppUser } from './profile-user.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUser(): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/app-users/me`);
  }

  updateAvatar(avatarUrl: string): Observable<AppUser> {
    return this.http.patch<AppUser>(`${this.apiUrl}/app-users/me`, { avatar_url: avatarUrl });
  }

  getRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.apiUrl}/rewards`);
  }

  getUserRequests(): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(`${this.apiUrl}/project-registration/my`);
  }

  getUserActivities(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.apiUrl}/app-users/activities`);
  }

  getFundraisingCampaigns(): Observable<FundraisingCampaign[]> {
    return this.http.get<FundraisingCampaign[]>(`${this.apiUrl}/fundraising_campaigns`);
  }

  deleteAvatar(): Observable<AppUser> {
    return this.http.delete<AppUser>(`${this.apiUrl}/app-users/me/avatar`);
  }
}
