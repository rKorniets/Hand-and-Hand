import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Organization,
  ActivityItem,
  FundraisingCampaign,
  Report,
  OrgMember,
} from './profile-organization.model';
import { AuthService } from '../auth/auth.service';
import { jwtDecode } from 'jwt-decode';

const DEFAULT_LIMIT = 50;

@Injectable({
  providedIn: 'root',
})
export class OrganizationProfileService {
  private readonly apiUrl = 'http://localhost:3000/organization-profiles';
  private readonly projectsUrl = 'http://localhost:3000/projects';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getOrganization(): Observable<Organization> {
    const token = this.authService.getToken();
    if (!token) return throwError(() => new Error('Токен відсутній'));

    try {
      const payload = jwtDecode<{ sub: number }>(token);
      const userId = payload.sub;
      return this.http.get<Organization>(`${this.apiUrl}/by-user/${userId}`);
    } catch {
      return throwError(() => new Error('Невалідний токен'));
    }
  }

  getOrganizationById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  getOrgMembers(orgId: number): Observable<OrgMember[]> {
    return this.http.get<OrgMember[]>(`${this.apiUrl}/${orgId}/members`);
  }

  getOrgReports(orgId: number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/${orgId}/reports`);
  }

  getOrgActivities(orgId: number, limit: number = DEFAULT_LIMIT): Observable<ActivityItem[]> {
    return this.http
      .get<{
        data: ActivityItem[];
        total: number;
      }>(`${this.projectsUrl}?organization_profile_id=${orgId}&limit=${limit}`)
      .pipe(map((res) => res.data));
  }

  getOrgFundraising(orgId: number): Observable<FundraisingCampaign[]> {
    return this.http.get<FundraisingCampaign[]>(`${this.apiUrl}/${orgId}/fundraising`);
  }
}
