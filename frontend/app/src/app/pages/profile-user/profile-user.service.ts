import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ITicket, ActivityItem, FundraisingCampaign, Reward, AppUser } from './profile-user.model';
import { API_BASE_URL } from '../../tokens';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

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
}
