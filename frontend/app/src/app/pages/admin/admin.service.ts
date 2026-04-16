import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PendingOrganization {
  id: number; // approval_request id
  created_at: string;
  submitter: {
    id: number;
    email: string;
    status: string;
    organization_profile: {
      id: number;
      name: string;
      edrpou: string;
      contact_email: string;
      created_at: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = 'http://localhost:3000/admin/organization-profiles';

  constructor(private http: HttpClient) {}

  getPendingOrganizations() {
    const nocache = `?t=${new Date().getTime()}`;
    return this.http.get<PendingOrganization[]>(`${this.API}/pending${nocache}`);
  }

  approveOrganization(approvalRequestId: number) {
    return this.http.patch(`${this.API}/approvals/${approvalRequestId}/approve`, {});
  }

  rejectOrganization(approvalRequestId: number) {
    return this.http.patch(`${this.API}/approvals/${approvalRequestId}/reject`, {});
  }
}
