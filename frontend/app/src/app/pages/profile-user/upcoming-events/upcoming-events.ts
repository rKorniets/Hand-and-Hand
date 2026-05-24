import {
  Component,
  OnInit,
  Input,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppUser, UpcomingRegistration, PastRegistration } from '../profile-user.model';
import { UiHelperService } from '../toggleExpansion.service';
import { UserProfileService } from '../profile-user.service';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './upcoming-events.html',
  styleUrl: './upcoming-events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingEvents implements OnInit {
  @Input() user: AppUser | undefined;
  @Input() isOwnProfile: boolean = false;

  upcomingEvents: UpcomingRegistration[] = [];
  pastEvents: PastRegistration[] = [];

  isPastExpanded: boolean = false;
  isModalOpen: boolean = false;

  constructor(
    private uiHelper: UiHelperService,
    private profileService: UserProfileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.isOwnProfile) {
      this.profileService.getMyUpcomingEvents().subscribe({
        next: (data) => {
          this.upcomingEvents = data;
          this.cdr.markForCheck();
        },
        error: () => {
          this.upcomingEvents = [];
          this.cdr.markForCheck();
        },
      });

      this.profileService.getMyPastEvents().subscribe({
        next: (data) => {
          this.pastEvents = data;
          this.cdr.markForCheck();
        },
        error: () => {
          this.pastEvents = [];
          this.cdr.markForCheck();
        },
      });
    } else if (this.user?.id) {
      // Для інших користувачів завантажуємо тільки минулі події (конфіденційність)
      this.profileService.getUserPastEvents(this.user.id).subscribe({
        next: (data) => {
          this.pastEvents = data;
          this.cdr.markForCheck();
        },
        error: () => {
          this.pastEvents = [];
          this.cdr.markForCheck();
        },
      });
    }
  }

  openModal(): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = '';
    this.cdr.markForCheck();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isModalOpen) this.closeModal();
  }

  togglePast(target: HTMLElement): void {
    this.isPastExpanded = this.uiHelper.toggleExpansion(this.isPastExpanded, target);
    this.cdr.markForCheck();
  }

  getStatusLabel(status: string): string {
    return status === 'ACCEPTED' ? 'Підтверджено' : 'На розгляді';
  }

  isAccepted(status: string): boolean {
    return status === 'ACCEPTED';
  }
}
