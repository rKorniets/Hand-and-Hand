import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ITicket, ActivityItem, FundraisingCampaign, Reward, AppUser } from './profile-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly apiUrl = 'http://localhost:3000/profile-user';

  constructor(private http: HttpClient) {}

  getUser(): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/user/me`);
  }

  getRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.apiUrl}/rewards`);
  }

  getUserRequests(): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(`${this.apiUrl}/user/requests`);
  }

  getUserActivities(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.apiUrl}/user/activities`);
  }

  getFundraisingCampaigns(): Observable<FundraisingCampaign[]> {
    return this.http.get<FundraisingCampaign[]>(`${this.apiUrl}/user/campaigns`);
  }
}
