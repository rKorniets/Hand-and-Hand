import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NewEvent, EventLocation } from '../event.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-events',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  providers: [],
  templateUrl: './list-events.html',
  styleUrl: './list-events.scss',
})
export class ListEvents {
  @Input() events: NewEvent[] = [];

  formatLocation(location: EventLocation): string {
    if (!location) return '';
    const { city, address } = location;
    return address ? `${city}, ${address}` : city;
  }
}
