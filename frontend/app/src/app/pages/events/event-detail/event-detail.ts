import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../event.service';
import { NewEvent } from '../event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.scss'],
})
export class EventDetailComponent implements OnInit {
  event: NewEvent | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event = data;
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
}
