import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TicketItem, TicketStatus, TicketPriority } from '../ticket.model';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets-list.html',
  styleUrls: ['./tickets-list.scss'],
})
export class TicketsListComponent {
  @Input() tickets: TicketItem[] = [];

  constructor(private router: Router) {}

  navigate(ticket: TicketItem): void {
    this.router.navigate(['/tickets', ticket.id]);
  }

  getStatusLabel(status: TicketStatus): string {
    const map: Record<TicketStatus, string> = {
      OPEN: 'Відкритий',
      IN_REVIEW: 'На розгляді',
      RESOLVED: 'Вирішено',
      CLOSED: 'Закрито',
      CANCELLED: 'Скасовано',
    };
    return map[status] ?? status;
  }

  getPriorityLabel(priority: TicketPriority): string {
    const map: Record<TicketPriority, string> = {
      LOW: 'Низький',
      MEDIUM: 'Середній',
      HIGH: 'Високий',
      URGENT: 'Терміново',
    };
    return map[priority] ?? priority;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
