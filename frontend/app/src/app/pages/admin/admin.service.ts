import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../tokens';
import { PendingNews, PendingOrganization, PendingProject, PendingTicket } from './admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  private getNoCacheParam() {
    return `?t=${new Date().getTime()}`;
  }

  getPendingOrganizations() {
    return this.http.get<PendingOrganization[]>(
      `${this.apiUrl}/admin/organization-profiles/pending${this.getNoCacheParam()}`,
    );
  }

  approveOrganization(approvalRequestId: number) {
    return this.http.patch(
      `${this.apiUrl}/admin/organization-profiles/approvals/${approvalRequestId}/approve`,
      {},
    );
  }

  rejectOrganization(approvalRequestId: number) {
    return this.http.patch(
      `${this.apiUrl}/admin/organization-profiles/approvals/${approvalRequestId}/reject`,
      {},
    );
  }

  getPendingProjects() {
    return this.http.get<PendingProject[]>(
      `${this.apiUrl}/admin/projects/pending${this.getNoCacheParam()}`,
    );
  }

  approveProject(approvalRequestId: number) {
    return this.http.patch(`${this.apiUrl}/admin/approvals/${approvalRequestId}/approve`, {});
  }

  rejectProject(approvalRequestId: number) {
    return this.http.patch(`${this.apiUrl}/admin/approvals/${approvalRequestId}/reject`, {});
  }

  getPendingTickets() {
    return this.http.get<PendingTicket[]>(
      `${this.apiUrl}/admin/tickets/pending${this.getNoCacheParam()}`,
    );
  }

  getOpenTickets() {
    return this.http.get<PendingTicket[]>(`${this.apiUrl}/tickets${this.getNoCacheParam()}`);
  }

  approveTicket(ticketId: number) {
    return this.http.patch(`${this.apiUrl}/admin/tickets/${ticketId}/approve`, {});
  }

  rejectTicket(ticketId: number) {
    return this.http.patch(`${this.apiUrl}/admin/tickets/${ticketId}/reject`, {});
  }

  getPendingNews() {
    return this.http.get<PendingNews[]>(
      `${this.apiUrl}/admin/news/pending${this.getNoCacheParam()}`,
    );
  }

  approveNews(newsId: number) {
    return this.http.patch(`${this.apiUrl}/admin/news/${newsId}/approve`, {});
  }

  rejectNews(newsId: number) {
    return this.http.patch(`${this.apiUrl}/admin/news/${newsId}/reject`, {});
  }
}
