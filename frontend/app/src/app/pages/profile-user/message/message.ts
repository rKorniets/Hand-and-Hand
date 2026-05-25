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

const INVITE_STATUS_KEY = 'org_invite_statuses';

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
  private socketSub?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadInviteStatusFromStorage();
    this.loadNotifications();

    this.socketSub = this.socketService
      .listen<UserNotification>('newNotification')
      .subscribe((newNotif: UserNotification) => {
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

  private loadInviteStatusFromStorage(): void {
    try {
      const raw = localStorage.getItem(INVITE_STATUS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, 'accepted' | 'rejected'>;
      for (const [key, val] of Object.entries(parsed)) {
        const id = Number(key);
        if (Number.isSafeInteger(id) && (val === 'accepted' || val === 'rejected')) {
          this.invitationStatus.set(id, val);
        }
      }
    } catch {
      // malformed storage — ignore
    }
  }

  private persistInviteStatus(): void {
    try {
      const obj: Record<string, string> = {};
      for (const [id, val] of this.invitationStatus) {
        obj[String(id)] = val;
      }
      localStorage.setItem(INVITE_STATUS_KEY, JSON.stringify(obj));
    } catch {
      // storage quota exceeded or private browsing — ignore
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
    // Invitation notifications are handled by their own buttons — skip mark-as-read and navigation
    if (this.isInvitation(n)) return;

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
        this.invitationStatus.delete(id);
        this.invitationError.delete(id);
        this.persistInviteStatus();
        this.total--;
        this.cdr.markForCheck();
      });
  }

  acceptInvitation(n: UserNotification, event: Event): void {
    event.stopPropagation();
    const invitationId = this.getInvitationId(n);
    if (invitationId === null) return;
    this.notificationService
      .acceptInvitation(invitationId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.invitationStatus.set(n.id, 'accepted');
          this.invitationError.delete(n.id);
          this.persistInviteStatus();
          if (!n.is_read) this.markAsRead(n.id);
          this.cdr.markForCheck();
        },
        error: () => {
          this.invitationError.set(n.id, 'Помилка. Спробуйте ще раз.');
          this.cdr.markForCheck();
        },
      });
  }

  rejectInvitation(n: UserNotification, event: Event): void {
    event.stopPropagation();
    const invitationId = this.getInvitationId(n);
    if (invitationId === null) return;
    this.notificationService
      .rejectInvitation(invitationId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.invitationStatus.set(n.id, 'rejected');
          this.invitationError.delete(n.id);
          this.persistInviteStatus();
          if (!n.is_read) this.markAsRead(n.id);
          this.cdr.markForCheck();
        },
        error: () => {
          this.invitationError.set(n.id, 'Помилка. Спробуйте ще раз.');
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
