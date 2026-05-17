import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TicketService } from './ticket.service';
import { TicketItem } from './ticket.model';
import { TicketsListComponent } from './tickets-list/tickets-list';
import { FiltersComponent } from '../../components/category/category';
import { FilterConfig, FilterState } from '../../components/category/category.model';
import { PaginationComponent } from '../../components/pagination/pagination';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, TicketsListComponent, FiltersComponent, PaginationComponent],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.scss'],
})
export class TicketsComponent implements OnInit, OnDestroy {
  tickets: TicketItem[] = [];
  filteredTickets: TicketItem[] = [];

  loading = false;
  error = false;

  currentPage = 1;
  readonly limit = 20;
  hasNextPage = false;

  searchQuery = '';
  activeTab: 'available' | 'my' = 'available';

  filterConfig: FilterConfig = {
    showSearch: true,
    showDateRange: false,
    showCity: false,
  };

  private readonly destroy$ = new Subject<void>();

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFiltersChanged(state: FilterState): void {
    this.searchQuery = state.search || '';
    this.currentPage = 1;
    this.loadTickets();
  }

  switchTab(tab: 'available' | 'my'): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.error = false;
    const skip = (this.currentPage - 1) * this.limit;
    this.ticketService
      .getTickets(this.limit, skip, this.searchQuery || undefined, this.activeTab)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.tickets = data;
          this.filteredTickets = [...data];
          this.hasNextPage = data.length === this.limit;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = true;
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadTickets();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }
}
