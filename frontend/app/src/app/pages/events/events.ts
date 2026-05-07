import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FiltersComponent } from '../../components/category/category';
import { FilterConfig, FilterState } from '../../components/category/category.model';
import { ListEvents } from './list-events/list-events';
import { MapComponent, MapEvent } from './map/map';
import { EventService } from './event.service';
import { NewEvent } from './event.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FiltersComponent, MapComponent, ListEvents],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {
  currentPage = 1;
  readonly limit = 5;
  totalPages = 1;
  events: NewEvent[] = [];
  mapEvents: MapEvent[] = [];

  filterConfig: FilterConfig = {
    showSearch: true,
    categoryContext: 'projects',
    showCity: true,
    showStatus: true,
    showDateRange: true,
  };

  activeFilters: FilterState = {
    search: '',
    categories: [],
    status: [],
    dateFrom: '',
    dateTo: '',
    city: '',
  };

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadMapEvents();
  }

  private toMapEvent(e: NewEvent): MapEvent {
    return {
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location
        ? {
            id: e.location.id ?? 0,
            lat: e.location.lat ?? null,
            lng: e.location.lng ?? null,
            city: e.location.city,
            address: e.location.address,
          }
        : undefined,
    };
  }

  loadEvents(): void {
    const skip = (this.currentPage - 1) * this.limit;

    this.eventService.getEvents(this.limit, skip).subscribe({
      next: ({ data, total }) => {
        this.events = data;
        this.totalPages = Math.ceil(total / this.limit);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  loadMapEvents(): void {
    this.eventService.getAllEventsForMap().subscribe({
      next: (data) => {
        this.mapEvents = data
          .filter((e) => e.location?.lat != null && e.location?.lng != null)
          .map((e) => this.toMapEvent(e));
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  handleOpenEvent(id: number): void {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.router.navigate(['/events', event.id]);
      },
      error: (err) => console.error(err),
    });
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  onFiltersChanged(filters: FilterState): void {
    this.activeFilters = filters;
    this.currentPage = 1;
    this.loadEvents();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get visiblePages(): (number | -1)[] {
    const pages: (number | -1)[] = [];
    const last = this.totalPages;

    if (last <= 5) {
      for (let i = 1; i <= last; i++) pages.push(i);
    } else {
      pages.push(1);
      if (this.currentPage > 3) pages.push(-1);
      for (
        let i = Math.max(2, this.currentPage - 1);
        i <= Math.min(last - 1, this.currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (this.currentPage < last - 2) pages.push(-1);
      pages.push(last);
    }

    return pages;
  }
}
