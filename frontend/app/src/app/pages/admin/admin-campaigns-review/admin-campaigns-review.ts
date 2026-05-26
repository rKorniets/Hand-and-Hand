import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';
import { PendingCampaign } from '../admin.model';

@Component({
  selector: 'app-admin-campaigns-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-campaigns-review.html',
  styleUrls: ['./admin-campaigns-review.scss'],
})
export class AdminCampaignsReviewComponent implements OnInit {
  campaigns: PendingCampaign[] = [];
  loading = true;
  error = '';
  actionLoading: number | null = null;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.loading = true;
    this.adminService.getPendingCampaigns().subscribe({
      next: (res) => {
        this.campaigns = Array.isArray(res.data) ? res.data : [];
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

  approveCampaign(id: number) {
    this.actionLoading = id;
    this.adminService.approveCampaign(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка підтвердження';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  rejectCampaign(id: number) {
    this.actionLoading = id;
    this.adminService.rejectCampaign(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка відхилення';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  private removeFromList(id: number) {
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
    this.actionLoading = null;
    this.cdr.detectChanges();
  }
}
