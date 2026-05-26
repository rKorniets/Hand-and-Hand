import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { PendingProject } from '../admin.model';

@Component({
  selector: 'app-admin-projects-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-projects-review.html',
  styleUrls: ['./admin-projects-review.scss'],
})
export class AdminProjectsReviewComponent implements OnInit {
  projects: PendingProject[] = [];
  loading = true;
  error = '';
  actionLoading: number | null = null;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.adminService.getPendingProjects().subscribe({
      next: (data) => {
        this.projects = data;
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

  openProject(projectId: number) {
    this.router.navigate(['/events', projectId]);
  }

  approveProject(id: number) {
    this.actionLoading = id;
    this.adminService.approveProject(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка підтвердження';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  rejectProject(id: number) {
    this.actionLoading = id;
    this.adminService.rejectProject(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка відхилення';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  private removeFromList(id: number) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.actionLoading = null;
    this.cdr.detectChanges();
  }
}
