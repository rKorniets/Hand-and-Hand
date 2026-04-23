import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService, PendingOrganization, PendingProject } from '../admin.service';

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

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadOrganizations();
    this.loadProjects();
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
}
