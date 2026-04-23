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
  private readonly API = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  private getNoCacheParam() {
    return `?t=${new Date().getTime()}`;
  }

  getPendingOrganizations() {
    return this.http.get<PendingOrganization[]>(
      `${this.API}/organization-profiles/pending${this.getNoCacheParam()}`,
    );
  }

  approveOrganization(approvalRequestId: number) {
    return this.http.patch(
      `${this.API}/organization-profiles/approvals/${approvalRequestId}/approve`,
      {},
    );
  }

  rejectOrganization(approvalRequestId: number) {
    return this.http.patch(
      `${this.API}/organization-profiles/approvals/${approvalRequestId}/reject`,
      {},
    );
  }

  getPendingProjects() {
    return this.http.get<PendingProject[]>(`${this.API}/projects/pending${this.getNoCacheParam()}`);
  }

  approveProject(approvalRequestId: number) {
    return this.http.patch(`${this.API}/approvals/${approvalRequestId}/approve`, {});
  }

  rejectProject(approvalRequestId: number) {
    return this.http.patch(`${this.API}/approvals/${approvalRequestId}/reject`, {});
  }
}
