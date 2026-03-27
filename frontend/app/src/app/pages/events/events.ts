import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categories } from './categories/categories';
import { ListEvents } from './list-events/list-events';
import { Map } from './map/map';
import { EventService } from './event.service';
import { NewEvent } from './event.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, Categories, Map, ListEvents],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {
  currentPage = 1;
  readonly limit = 5;
  totalPages = 1;
  events: NewEvent[] = [];

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
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

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
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
