import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { interval, Subscription, switchMap, take } from 'rxjs';
import { AppUser, UserNotification } from '../profile-user.model';
import { NotificationService, NotificationResponse } from './message.service';
import { UserProfileService } from '../profile-user.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './message.html',
  styleUrl: './message.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Message implements OnInit, OnDestroy {
  @Input() user?: AppUser;

  isPanelOpen = false;
  isHovered = false;
  notifications: UserNotification[] = [];
  total = 0;

  private pollingSub?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private profileService: UserProfileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadNotifications();
    this.startPolling();
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  private startPolling() {
    this.pollingSub = interval(10000)
      .pipe(switchMap(() => this.notificationService.getMyNotifications()))
      .subscribe((res: NotificationResponse) => {
        const hasNewWarning = res.data.some(
          (n: UserNotification) =>
            n.type === 'WARNING' &&
            !n.is_read &&
            !this.notifications.find((old: UserNotification) => old.id === n.id),
        );

        this.notifications = res.data;
        this.total = res.total;

        if (hasNewWarning) {
          this.profileService
            .getUser()
            .pipe(take(1))
            .subscribe((updatedUser: AppUser) => {
              if (this.user) {
                this.user.avatar_url = updatedUser.avatar_url;
              }
              this.cdr.markForCheck();
            });
        }

        this.cdr.markForCheck();
      });
  }

  loadNotifications() {
    this.notificationService
      .getMyNotifications()
      .pipe(take(1))
      .subscribe((res: NotificationResponse) => {
        this.notifications = res.data;
        this.total = res.total;
        this.cdr.markForCheck();
      });
  }

  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
    this.cdr.markForCheck();
  }

  markAsRead(id: number) {
    this.notificationService
      .markAsRead(id)
      .pipe(take(1))
      .subscribe(() => {
        this.notifications = this.notifications.map((n: UserNotification) =>
          n.id === id ? { ...n, is_read: true } : n,
        );
        this.cdr.markForCheck();
      });
  }

  markAllAsRead() {
    this.notificationService
      .markAllAsRead()
      .pipe(take(1))
      .subscribe(() => {
        this.notifications = this.notifications.map((n: UserNotification) => ({
          ...n,
          is_read: true,
        }));
        this.cdr.markForCheck();
      });
  }

  deleteNotification(id: number) {
    this.notificationService
      .delete(id)
      .pipe(take(1))
      .subscribe(() => {
        this.notifications = this.notifications.filter((n: UserNotification) => n.id !== id);
        this.total--;
        this.cdr.markForCheck();
      });
  }

  getUnreadCount(): string {
    const count = this.notifications.filter((n: UserNotification) => !n.is_read).length;
    return count > 99 ? '99+' : String(count);
  }

  hasUnread(): boolean {
    return this.notifications.some((n: UserNotification) => !n.is_read);
  }
}
