<<<<<<< feat/profil-user
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
=======
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
>>>>>>> main
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Organization,
  ActivityItem,
  FundraisingCampaign,
  Report,
  OrgMember,
} from './profile-organization.model';
import { ProjectRegistration, ProjectRegistrationStatus } from '../events/event.model';
import { AuthService } from '../auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../../tokens';

const DEFAULT_LIMIT = 50;

@Injectable({
  providedIn: 'root',
})
export class OrganizationProfileService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  getOrganization(): Observable<Organization> {
    const token = this.authService.getToken();
    if (!token) return throwError(() => new Error('Токен відсутній'));

    try {
      const payload = jwtDecode<{ sub: number }>(token);
      const userId = payload.sub;
      return this.http.get<Organization>(`${this.apiUrl}/organization-profiles/by-user/${userId}`);
    } catch {
      return throwError(() => new Error('Невалідний токен'));
    }
  }

  getOrganizationById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/organization-profiles/${id}`);
  }

  getOrgMembers(orgId: number): Observable<OrgMember[]> {
    return this.http.get<OrgMember[]>(`${this.apiUrl}/organization-profiles/${orgId}/members`);
  }

  getOrgReports(orgId: number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/organization-profiles/${orgId}/reports`);
  }

  getOrgActivities(orgId: number, limit: number = DEFAULT_LIMIT): Observable<ActivityItem[]> {
    return this.http
      .get<{
        data: ActivityItem[];
        total: number;
      }>(`${this.apiUrl}/projects?organization_profile_id=${orgId}&limit=${limit}`)
      .pipe(map((res) => res.data));
  }

  getOrgFundraising(orgId: number): Observable<FundraisingCampaign[]> {
    return this.http.get<FundraisingCampaign[]>(
      `${this.apiUrl}/organization-profiles/${orgId}/fundraising`,
    );
  }

  listProjectRegistrations(
    projectId: number,
    status?: ProjectRegistrationStatus,
  ): Observable<ProjectRegistration[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ProjectRegistration[]>(
      `${this.projectsUrl}/${projectId}/registrations/manage`,
      { params },
    );
  }

  acceptProjectRegistration(
    projectId: number,
    registrationId: number,
  ): Observable<ProjectRegistration> {
    return this.http.patch<ProjectRegistration>(
      `${this.projectsUrl}/${projectId}/registrations/${registrationId}/accept`,
      {},
    );
  }

  rejectProjectRegistration(
    projectId: number,
    registrationId: number,
  ): Observable<ProjectRegistration> {
    return this.http.patch<ProjectRegistration>(
      `${this.projectsUrl}/${projectId}/registrations/${registrationId}/reject`,
      {},
    );
  }
}
