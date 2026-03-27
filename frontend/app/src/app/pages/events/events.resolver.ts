import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { EventService, PaginatedEvents } from './event.service';

@Injectable({ providedIn: 'root' })
export class EventsResolver implements Resolve<PaginatedEvents> {
  constructor(private eventService: EventService) {}

  resolve(): Observable<PaginatedEvents> {
    return this.eventService.getEvents();
  }
}
