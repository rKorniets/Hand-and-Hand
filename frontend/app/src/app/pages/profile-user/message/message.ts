import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { take, Subscription } from 'rxjs';
import { AppUser, UserNotification } from '../profile-user.model';
import { NotificationService, NotificationResponse } from './message.service';
import { SocketService } from '../../../services/socket.service';

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
  invitationStatus = new Map<number, 'accepted' | 'rejected'>();
  invitationError = new Map<number, string>();
  invitingInProgress = new Set<number>();
  private socketSub?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadNotifications();

    this.socketSub = this.socketService
      .listen<UserNotification>('newNotification')
      .subscribe((newNotif: UserNotification) => {
        if (this.notifications.some((n) => n.id === newNotif.id)) return;
        this.notifications = [newNotif, ...this.notifications];
        this.total++;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    if (this.socketSub) {
      this.socketSub.unsubscribe();
    }
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

  isInvitation(n: UserNotification): boolean {
    return n.type === 'ORGANIZATION_INVITE';
  }

  getInvitationId(n: UserNotification): number | null {
    const link = n.link ?? '';
    if (!/^\d+$/.test(link)) return null;
    const id = Number(link);
    return Number.isSafeInteger(id) ? id : null;
  }

  hasValidInvitationId(n: UserNotification): boolean {
    return this.getInvitationId(n) !== null;
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

    if (n.link && !this.isInvitation(n)) {
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
        this.notifications = this.notifications.map((n: UserNotification) =>
          this.isInvitation(n) ? n : { ...n, is_read: true },
        );
        this.cdr.markForCheck();
      });
  }

  deleteNotification(id: number) {
    this.notificationService
      .delete(id)
      .pipe(take(1))
      .subscribe(() => {
        this.notifications = this.notifications.filter((n: UserNotification) => n.id !== id);
        this.invitationStatus.delete(id);
        this.invitationError.delete(id);
        this.invitingInProgress.delete(id);
        this.total--;
        this.cdr.markForCheck();
      });
  }

  acceptInvitation(n: UserNotification, event: Event): void {
    event.stopPropagation();
    if (this.invitingInProgress.has(n.id)) return;
    const invitationId = this.getInvitationId(n);
    if (invitationId === null) return;
    this.invitingInProgress.add(n.id);
    this.notificationService
      .acceptInvitation(invitationId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.invitingInProgress.delete(n.id);
          this.invitationStatus.set(n.id, 'accepted');
          this.invitationError.delete(n.id);
          if (!n.is_read) this.markAsRead(n.id);
          this.cdr.markForCheck();
        },
        error: (e: unknown) => {
          this.invitingInProgress.delete(n.id);
          this.invitationError.set(
            n.id,
            e instanceof Error ? e.message : 'Помилка. Спробуйте ще раз.',
          );
          this.cdr.markForCheck();
        },
      });
  }

  rejectInvitation(n: UserNotification, event: Event): void {
    event.stopPropagation();
    if (this.invitingInProgress.has(n.id)) return;
    const invitationId = this.getInvitationId(n);
    if (invitationId === null) return;
    this.invitingInProgress.add(n.id);
    this.notificationService
      .rejectInvitation(invitationId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.invitingInProgress.delete(n.id);
          this.invitationStatus.set(n.id, 'rejected');
          this.invitationError.delete(n.id);
          if (!n.is_read) this.markAsRead(n.id);
          this.cdr.markForCheck();
        },
        error: (e: unknown) => {
          this.invitingInProgress.delete(n.id);
          this.invitationError.set(
            n.id,
            e instanceof Error ? e.message : 'Помилка. Спробуйте ще раз.',
          );
          this.cdr.markForCheck();
        },
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
