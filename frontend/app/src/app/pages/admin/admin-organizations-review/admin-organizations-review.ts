import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';
import { PendingOrganization } from '../admin.model';

@Component({
  selector: 'app-admin-organizations-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-organizations-review.html',
  styleUrls: ['./admin-organizations-review.scss'],
})
export class AdminOrganizationsReviewComponent implements OnInit {
  items: PendingOrganization[] = [];
  loading = true;
  error = '';
  actionLoading: number | null = null;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadOrganizations();
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

  private removeFromList(id: number) {
    this.items = this.items.filter((i) => i.id !== id);
    this.actionLoading = null;
    this.cdr.detectChanges();
  }
}
