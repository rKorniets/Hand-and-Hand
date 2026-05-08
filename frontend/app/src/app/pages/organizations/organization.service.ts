import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Organization,
  OrgEvent,
  OrgReport,
  Member,
  MembershipRequest,
  FundraisingCampaign,
} from './organizations.model';
import { API_BASE_URL } from '../../tokens';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  getOrganizations(
    limit = 10,
    skip = 0,
    search?: string,
    categories?: string[],
  ): Observable<{ data: Organization[]; total: number }> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);

    if (search) params = params.set('search', search);
    if (categories?.length) params = params.set('categories', categories.join(','));

    return this.http.get<{ data: Organization[]; total: number }>(
      `${this.apiUrl}/organization-profiles`,
      { params },
    );
  }

  getOrganizationById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/organization-profiles/${id}`);
  }
  getOrganizationProjects(id: number): Observable<OrgEvent[]> {
    return this.http.get<OrgEvent[]>(`${this.apiUrl}/organization-profiles/${id}/projects`);
  }

  getOrganizationReports(id: number): Observable<OrgReport[]> {
    return this.http.get<OrgReport[]>(`${this.apiUrl}/organization-profiles/${id}/reports`);
  }

  getOrganizationMembers(id: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/organization-profiles/${id}/members`);
  }

  getOrganizationFundraising(id: number): Observable<FundraisingCampaign[]> {
    return this.http.get<FundraisingCampaign[]>(
      `${this.apiUrl}/organization-profiles/${id}/fundraising`,
    );
  }
  joinOrganization(orgId: number): Observable<MembershipRequest> {
    return this.http.post<MembershipRequest>(
      `${this.apiUrl}/organization-profiles/${orgId}/membership-requests`,
      {},
    );
  }

  getMyMembershipStatus(orgId: number): Observable<MembershipRequest | null> {
    return this.http.get<MembershipRequest | null>(
      `${this.apiUrl}/organization-profiles/${orgId}/membership-requests/me`,
    );
  }

  leaveOrganization(orgId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/organization-profiles/${orgId}/members/me`);
  }
}
