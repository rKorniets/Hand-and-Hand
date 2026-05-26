import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { PendingNews } from '../admin.model';

@Component({
  selector: 'app-admin-news-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-news-review.html',
  styleUrls: ['./admin-news-review.scss'],
})
export class AdminNewsReviewComponent implements OnInit {
  news: PendingNews[] = [];
  loading = true;
  error = '';
  actionLoading: number | null = null;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.loading = true;
    this.adminService.getPendingNews().subscribe({
      next: (data) => {
        this.news = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Помилка завантаження новин';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openNews(newsId: number) {
    this.router.navigate(['/news', newsId], {
      queryParams: { preview: 'admin' },
    });
  }

  approveNews(id: number) {
    this.actionLoading = id;
    this.adminService.approveNews(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка підтвердження новин';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  rejectNews(id: number) {
    this.actionLoading = id;
    this.adminService.rejectNews(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка відхилення новин';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  private removeFromList(id: number) {
    this.news = this.news.filter((n) => n.id !== id);
    this.actionLoading = null;
    this.cdr.detectChanges();
  }
}
