import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../events/event.service';
import { NewEvent } from '../../events/event.model';

@Component({
  selector: 'app-footer-content',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer-content.html',
  styleUrl: './footer-content.scss',
})
export class FooterContent implements OnInit {
  events: NewEvent[] = [];

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.eventService.getEvents(10, 0).subscribe({
      next: (response) => {
        if (response && response.data) {
          setTimeout(() => {
            this.events = response.data.slice(0, 6);

            this.cdr.detectChanges();
          }, 0);
        }
      },
      error: (err: unknown) => {
        console.error('Помилка запиту подій:', err);
      },
    });
  }
}
