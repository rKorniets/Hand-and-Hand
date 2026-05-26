import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';
import { PendingTicket } from '../admin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-tickets-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-tickets-review.html',
  styleUrls: ['./admin-tickets-review.scss'],
})
export class AdminTicketsReviewComponent implements OnInit {
  tickets: PendingTicket[] = [];
  loading = true;
  error = '';
  actionLoading: number | null = null;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  openTicket(ticketId: number) {
    this.router.navigate(['/tickets', ticketId]);
  }

  loadTickets() {
    this.loading = true;
    this.adminService.getPendingTickets().subscribe({
      next: (data) => {
        this.tickets = data;
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

  approveTicket(id: number) {
    this.actionLoading = id;
    this.adminService.approveTicket(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка підтвердження';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  rejectTicket(id: number) {
    this.actionLoading = id;
    this.adminService.rejectTicket(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => {
        this.error = 'Помилка відхилення';
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
    });
  }

  private removeFromList(id: number) {
    this.tickets = this.tickets.filter((t) => t.id !== id);
    this.actionLoading = null;
    this.cdr.detectChanges();
  }
}
