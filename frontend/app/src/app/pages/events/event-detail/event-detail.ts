import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../event.service';
import { AuthService } from '../../auth/auth.service';
import { NewEvent, ProjectRegistration } from '../event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.scss'],
})
export class EventDetailComponent implements OnInit {
  event: NewEvent | null = null;
  loading = true;
  error = false;

  myRegistration: ProjectRegistration | null = null;
  isLoggedIn = false;
  eventId = 0;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoggedIn = this.authService.isLoggedIn();

    this.eventService.getEventById(this.eventId).subscribe({
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

    if (this.isLoggedIn) {
      this.eventService.getMyRegistration(this.eventId).subscribe({
        next: (reg) => {
          this.myRegistration = reg;
          this.cdr.detectChanges();
        },
        error: () => {
          this.myRegistration = null;
        },
      });
    }
  }

  register(): void {
    this.eventService.register(this.eventId).subscribe({
      next: (reg) => {
        this.myRegistration = reg;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Помилка реєстрації:', err);
      },
    });
  }

  unregister(): void {
    this.eventService.unregister(this.eventId).subscribe({
      next: () => {
        this.myRegistration = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Помилка скасування:', err);
      },
    });
  }
}
