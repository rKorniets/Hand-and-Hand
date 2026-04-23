import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PendingOrganization {
  id: number;
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

export interface PendingProject {
  id: number;
  created_at: string;
  entity_id: number;
  submitter: {
    id: number;
    email: string;
    organization_profile: {
      name: string;
    };
  };
  project: {
    id: number;
    title: string;
    description: string;
    status: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPendingOrganizations() {
    const nocache = `?t=${new Date().getTime()}`;
    return this.http.get<PendingOrganization[]>(
      `${this.API}/admin/organization-profiles/pending${nocache}`,
    );
  }

  approveOrganization(approvalRequestId: number) {
    return this.http.patch(
      `${this.API}/admin/organization-profiles/approvals/${approvalRequestId}/approve`,
      {},
    );
  }

  rejectOrganization(approvalRequestId: number) {
    return this.http.patch(
      `${this.API}/admin/organization-profiles/approvals/${approvalRequestId}/reject`,
      {},
    );
  }

  getPendingProjects() {
    const nocache = `?t=${new Date().getTime()}`;
    return this.http.get<PendingProject[]>(`${this.API}/admin/projects/pending${nocache}`);
  }

  approveProject(approvalRequestId: number) {
    return this.http.patch(`${this.API}/admin/approvals/${approvalRequestId}/approve`, {});
  }

  rejectProject(approvalRequestId: number) {
    return this.http.patch(`${this.API}/admin/approvals/${approvalRequestId}/reject`, {});
  }
}
