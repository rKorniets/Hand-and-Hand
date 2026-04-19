import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, PendingOrganization } from '../admin.service';

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

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.adminService.getPendingOrganizations().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Помилка в компоненті:', err);
        this.error = 'Помилка завантаження';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approve(id: number) {
    this.actionLoading = id;
    this.adminService.approveOrganization(id).subscribe({
      next: () => {
        this.items = this.items.filter((i) => i.id !== id);
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
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
      next: () => {
        this.items = this.items.filter((i) => i.id !== id);
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Помилка відхилення';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }
}
