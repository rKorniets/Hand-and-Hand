import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Organization, ActivityItem, FundraisingCampaign, Report } from './profile-organization.model';
import { AuthService } from '../auth/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class OrganizationProfileService {
  private readonly apiUrl = 'http://localhost:3000/organization-profiles';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getOrganization(): Observable<Organization> {
    const token = this.authService.getToken();
    if (!token) return throwError(() => new Error('Токен відсутній'));

    try {
      const payload = jwtDecode<{ sub: number }>(token);
      const userId = payload.sub;

      return this.http.get<Organization>(`${this.apiUrl}/${userId}`);
    } catch {
      return throwError(() => new Error('Невалідний токен'));
    }
  }

  getOrgMembers(orgId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orgId}/members`);
  }

  getOrgReports(orgId: number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/${orgId}/reports`);
  }

  getOrgActivities(orgId: number): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.apiUrl}/${orgId}/activities`);
  }

  getOrgFundraising(orgId: number): Observable<FundraisingCampaign[]> {
    return this.http.get<FundraisingCampaign[]>(`${this.apiUrl}/${orgId}/fundraising`);
  }
}
