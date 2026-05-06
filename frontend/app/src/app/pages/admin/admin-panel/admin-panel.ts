import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { PendingNews, PendingOrganization, PendingProject, PendingTicket } from '../admin.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.scss'],
})
export class AdminPanelComponent implements OnInit {
  items: PendingOrganization[] = [];
  loading = true;
  error = '';
  actionLoading: number | null = null;

  projects: PendingProject[] = [];
  projectsLoading = true;
  projectsError = '';
  projectActionLoading: number | null = null;

  tickets: PendingTicket[] = [];
  ticketsLoading = true;
  ticketsError = '';
  ticketActionLoading: number | null = null;

  pendingNews: PendingNews[] = [];
  newsLoading = true;
  newsError = '';
  newsActionLoading: number | null = null;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadOrganizations();
    this.loadProjects();
    this.loadTickets();
    this.loadPendingNews();
  }

  loadOrganizations() {
    this.loading = true;
    this.adminService.getPendingOrganizations().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Помилка завантаження';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadProjects() {
    this.projectsLoading = true;
    this.adminService.getPendingProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.projectsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.projectsError = 'Помилка завантаження';
        this.projectsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadTickets() {
    this.ticketsLoading = true;
    this.adminService.getPendingTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.ticketsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.ticketsError = 'Помилка завантаження';
        this.ticketsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadPendingNews() {
    this.newsLoading = true;
    this.adminService.getPendingNews().subscribe({
      next: (data) => {
        this.pendingNews = data;
        this.newsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.newsError = 'Помилка завантаження новин';
        this.newsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openProject(projectId: number) {
    this.router.navigate(['/events', projectId]);
  }

  approve(id: number) {
    this.actionLoading = id;
    this.adminService.approveOrganization(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка підтвердження';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  reject(id: number) {
    this.actionLoading = id;
    this.adminService.rejectOrganization(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка відхилення';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  approveProject(id: number) {
    this.projectActionLoading = id;
    this.adminService.approveProject(id).subscribe({
      next: () => this.removeProjectFromList(id),
      error: () => {
        this.projectsError = 'Помилка підтвердження';
        this.projectActionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  rejectProject(id: number) {
    this.projectActionLoading = id;
    this.adminService.rejectProject(id).subscribe({
      next: () => this.removeProjectFromList(id),
      error: () => {
        this.projectsError = 'Помилка відхилення';
        this.projectActionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  approveTicketAction(id: number) {
    this.ticketActionLoading = id;
    this.adminService.approveTicket(id).subscribe({
      next: () => this.removeTicketFromList(id),
      error: () => {
        this.ticketsError = 'Помилка підтвердження';
        this.ticketActionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  rejectTicketAction(id: number) {
    this.ticketActionLoading = id;
    this.adminService.rejectTicket(id).subscribe({
      next: () => this.removeTicketFromList(id),
      error: () => {
        this.ticketsError = 'Помилка відхилення';
        this.ticketActionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  openNews(newsId: number) {
    this.router.navigate(['/news', newsId]);
  }

  approveNewsAction(id: number) {
    this.newsActionLoading = id;
    this.adminService.approveNews(id).subscribe({
      next: () => this.removeNewsFromList(id),
      error: () => {
        this.newsError = 'Помилка підтвердження новин';
        this.newsActionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  rejectNewsAction(id: number) {
    this.newsActionLoading = id;
    this.adminService.rejectNews(id).subscribe({
      next: () => this.removeNewsFromList(id),
      error: () => {
        this.newsError = 'Помилка відхилення новин';
        this.newsActionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  private removeFromList(id: number) {
    this.items = this.items.filter((i) => i.id !== id);
    this.actionLoading = null;
    this.cdr.detectChanges();
  }

  private removeProjectFromList(id: number) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.projectActionLoading = null;
    this.cdr.detectChanges();
  }

  private removeTicketFromList(id: number) {
    this.tickets = this.tickets.filter((t) => t.id !== id);
    this.ticketActionLoading = null;
    this.cdr.detectChanges();
  }

  private removeNewsFromList(id: number) {
    this.pendingNews = this.pendingNews.filter((n) => n.id !== id);
    this.newsActionLoading = null;
    this.cdr.detectChanges();
  }
}
