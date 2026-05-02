import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import {
  Organization,
  OrgNotification,
  ProjectRegistrationStatus,
} from '../profile-organization.model';
import { NotificationService, NotificationResponse } from './message-org.service';
import { OrganizationProfileService } from '../profile-organization.service';

@Component({
  selector: 'app-message-org',
  standalone: true,
  imports: [DatePipe, RouterModule],
  templateUrl: './message-org.html',
  styleUrl: './message-org.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageOrg implements OnInit, OnDestroy {
  @Input() organization?: Organization;
  public readonly RegistrationStatus = ProjectRegistrationStatus;

  isPanelOpen = false;
  isHovered = false;
  notifications: OrgNotification[] = [];
  total = 0;

  private clickTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private orgProfileService: OrganizationProfileService,
  ) {}

  handleNotificationClick(n: OrgNotification) {
    const isPendingRegistration =
      n.type === 'REGISTRATION' && n.registration_data?.status === this.RegistrationStatus.PENDING;
    const userId = n.user_id || n.registration_data?.user_id;

    if (userId) {
      this.router.navigate(['/profile-user', userId]).then(() => {
        this.isPanelOpen = false;
        this.cdr.markForCheck();
      });
    }

    if (!n.is_read && !isPendingRegistration) {
      this.markAsRead(n.id);
    }
  }

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
    }
  }

  loadNotifications() {
    this.notificationService
      .getMyNotifications()
      .pipe(take(1))
      .subscribe((res: NotificationResponse) => {
        // Фільтруємо: прибираємо прочитані сповіщення (пункт 3)
        this.notifications = res.data.filter((n) => !n.is_read);
        this.total = this.notifications.length;
        this.cdr.markForCheck();
      });
  }

  markAllAsRead() {
    const toMark = this.notifications
      .filter(
        (n) =>
          n.type !== 'REGISTRATION' ||
          n.registration_data?.status !== this.RegistrationStatus.PENDING,
      )
      .map((n) => n.id);

    if (toMark.length === 0) return;

    this.notificationService.markAllAsRead().subscribe(() => {
      this.loadNotifications();
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
        this.notifications = this.notifications.map((n: OrgNotification) =>
          n.id === id ? { ...n, is_read: true } : n,
        );
        this.cdr.markForCheck();
      });
  }

  deleteNotification(id: number) {
    this.notificationService
      .delete(id)
      .pipe(take(1))
      .subscribe(() => {
        this.notifications = this.notifications.filter((n: OrgNotification) => n.id !== id);
        this.total--;
        this.cdr.markForCheck();
      });
  }

  getUnreadCount(): string {
    const count = this.notifications.filter((n: OrgNotification) => !n.is_read).length;
    return count > 99 ? '99+' : String(count);
  }

  hasUnread(): boolean {
    return this.notifications.some((n: OrgNotification) => !n.is_read);
  }
  onAccept(n: OrgNotification) {
    const regId = n.registration_data?.id;
    const projId = n.project_id;

    if (!projId || !regId) return;

    this.orgProfileService
      .acceptProjectRegistration(projId, regId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          if (n.registration_data) {
            n.registration_data.status = this.RegistrationStatus.ACCEPTED;
          }
          this.markAsRead(n.id);
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Помилка прийому:', err),
      });
  }

  onReject(n: OrgNotification) {
    const regId = n.registration_data?.id;
    const projId = n.project_id;

    if (!projId || !regId) return;

    this.orgProfileService
      .rejectProjectRegistration(projId, regId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          if (n.registration_data) {
            n.registration_data.status = this.RegistrationStatus.REJECTED;
          }
          this.markAsRead(n.id);
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Помилка відхилення:', err),
      });
  }
}
