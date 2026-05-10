import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AppUser, UserNotification } from '../profile-user.model';
import { NotificationService, NotificationResponse } from './message.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './message.html',
  styleUrl: './message.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Message implements OnInit {
  @Input() user?: AppUser;

  isPanelOpen = false;
  isHovered = false;
  notifications: UserNotification[] = [];
  total = 0;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadNotifications();
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

  onNotificationClick(n: UserNotification) {
    if (!n.is_read) {
      this.notificationService
        .markAsRead(n.id)
        .pipe(take(1))
        .subscribe(() => {
          this.notifications = this.notifications.map((item: UserNotification) =>
            item.id === n.id ? { ...item, is_read: true } : item,
          );
          this.cdr.markForCheck();
        });
    }

    if (n.link) {
      this.isPanelOpen = false;
      void this.router.navigate([n.link]);
    }
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
