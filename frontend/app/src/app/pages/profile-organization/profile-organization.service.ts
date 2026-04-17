import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization, ActivityItem, FundraisingCampaign, OrgMember, Report} from './profile-organization.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizationProfileService {
  private readonly apiUrl = 'http://localhost:3000/profile-organization';

  constructor(private http: HttpClient) {}

  getOrganization(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  getOrgActivities(orgId: number): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.apiUrl}/${orgId}/activities`);
  }

  getOrgFundraising(orgId: number): Observable<FundraisingCampaign[]> {
    return this.http.get<FundraisingCampaign[]>(`${this.apiUrl}/${orgId}/fundraising`);
  }

  getOrgMembers(orgId: number): Observable<OrgMember[]> {
    return this.http.get<OrgMember[]>(`${this.apiUrl}/${orgId}/members`);
  }

  getOrgReports(orgId: number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/${orgId}/reports`);
  }
}
