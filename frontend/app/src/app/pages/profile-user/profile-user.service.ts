import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  ITicket,
  FundraisingCampaign,
  Reward,
  AppUser,
  UpcomingRegistration,
  PastRegistration,
} from './profile-user.model';
import { API_BASE_URL } from '../../tokens';

export interface FundraisingCampaignResponse {
  data: FundraisingCampaign[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  getUser(): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/app-users/me`);
  }

  getUserById(id: number): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/app-users/${id}`);
  }

  getRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.apiUrl}/rewards`);
  }

  getMyTickets(): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(`${this.apiUrl}/tickets/my`);
  }

  getFundraisingCampaigns(): Observable<FundraisingCampaignResponse> {
    return this.http.get<FundraisingCampaignResponse>(`${this.apiUrl}/fundraising_campaigns`);
  }

  getUserFundraisingCampaigns(userId: number): Observable<FundraisingCampaignResponse> {
    return this.http.get<FundraisingCampaignResponse>(
      `${this.apiUrl}/fundraising_campaigns?volunteer_user_id=${userId}`,
    );
  }

  getMyUpcomingEvents(): Observable<UpcomingRegistration[]> {
    return this.http.get<UpcomingRegistration[]>(`${this.apiUrl}/projects/my-upcoming`);
  }

  getMyPastEvents(): Observable<PastRegistration[]> {
    return this.http.get<PastRegistration[]>(`${this.apiUrl}/projects/my-past`);
  }

  getUserPastEvents(userId: number): Observable<PastRegistration[]> {
    return this.http.get<PastRegistration[]>(`${this.apiUrl}/projects/user/${userId}/past`);
  }
}
