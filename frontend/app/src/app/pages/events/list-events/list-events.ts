import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NewEvent, EventLocation } from '../event.model';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

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
  constructor(private sanitizer: DomSanitizer) {} // ← додати

  getImageStyle(url?: string): SafeStyle {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }
  formatLocation(location: EventLocation): string {
    if (!location) return '';
    const { city, address } = location;
    return address ? `${city}, ${address}` : city;
  }
}
