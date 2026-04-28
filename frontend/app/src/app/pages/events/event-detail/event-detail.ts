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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventId = Number(id);
      this.isLoggedIn = this.authService.isLoggedIn();
      this.loadEventData();
    }
  }

  private loadEventData(): void {
    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        this.loading = false;
        this.checkRegistration();
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private checkRegistration(): void {
    if (this.isLoggedIn) {
      this.eventService.getMyRegistration(this.eventId).subscribe({
        next: (reg) => {
          this.myRegistration = reg;
          this.cdr.detectChanges();
        },
        error: () => {
          this.myRegistration = null;
          this.cdr.detectChanges();
        },
      });
    }
  }

  get joinedCount(): number {
    return this.event?.volunteers?.length || 0;
  }

  get progressWidth(): number {
    if (!this.event || !this.event.participants) return 0;
    const calc = (this.joinedCount / this.event.participants) * 100;
    return Math.min(calc, 100);
  }

  get remainingSpots(): number {
    if (!this.event || !this.event.participants) return 0;
    const res = this.event.participants - this.joinedCount;
    return res > 0 ? res : 0;
  }

  get isRegistrationOpen(): boolean {
    return this.remainingSpots > 0;
  }

  register(): void {
    this.eventService.register(this.eventId).subscribe({
      next: (reg) => {
        this.myRegistration = reg;
        this.refreshEvent();
      },
      error: (err) => console.error(err),
    });
  }

  unregister(): void {
    this.eventService.unregister(this.eventId).subscribe({
      next: () => {
        this.myRegistration = null;
        this.refreshEvent();
      },
      error: (err) => console.error(err),
    });
  }

  private refreshEvent(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        this.cdr.detectChanges();
      },
    });
  }
}
