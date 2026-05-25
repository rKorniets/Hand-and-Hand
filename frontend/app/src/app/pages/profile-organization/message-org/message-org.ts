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
import { Organization, OrgNotification } from '../profile-organization.model';
import { ProjectRegistrationStatus } from '../../events/event.model';
import { NotificationService, NotificationResponse } from './message-org.service';
import { OrganizationProfileService } from '../profile-organization.service';
import { notification_organization_type_enum } from '@prisma/client';

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
  public readonly NotificationType = notification_organization_type_enum;

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
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
      if (!n.is_read) this.markAsRead(n.id);
      return;
    }
    this.clickTimer = setTimeout(() => {
      this.clickTimer = null;
      const userId = n.user_id ?? n.registration_data?.user_id;
      if (userId) {
        this.router.navigate(['/profile-user', userId]).then(() => {
          this.isPanelOpen = false;
          this.cdr.markForCheck();
        });
      }
    }, 250);
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
        this.notifications = res.data;
        this.total = res.total;
        this.cdr.markForCheck();
      });
  }

  isActionable(n: OrgNotification): boolean {
    return (
      n.type === this.NotificationType.REGISTRATION ||
      n.type === this.NotificationType.JOININGORG ||
      n.type === this.NotificationType.LEAVE_REQUEST
    );
  }

  hasNonActionableUnread(): boolean {
    return this.notifications.some((n) => !n.is_read && !this.isActionable(n));
  }

  markAllAsRead() {
    if (!this.hasNonActionableUnread()) return;

    this.notificationService
      .markAllAsRead()
      .pipe(take(1))
      .subscribe(() => {
        this.notifications = this.notifications.map((n) =>
          this.isActionable(n) ? n : { ...n, is_read: true },
        );
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
    const orgId = this.organization?.id;
    if (!regId) return;

    if (n.type === this.NotificationType.REGISTRATION && n.project_id) {
      this.orgProfileService
        .acceptProjectRegistration(n.project_id, regId)
        .pipe(take(1))
        .subscribe({
          next: () => this.updateUIAfterAction(n, this.RegistrationStatus.ACCEPTED),
          error: (err) => console.error(err),
        });
    } else if (n.type === this.NotificationType.JOININGORG) {
      this.orgProfileService
        .acceptOrganizationMember(regId)
        .pipe(take(1))
        .subscribe({
          next: () => this.updateUIAfterAction(n, this.RegistrationStatus.ACCEPTED),
          error: (err) => console.error(err),
        });
    } else if (n.type === this.NotificationType.LEAVE_REQUEST && orgId) {
      this.orgProfileService
        .acceptLeaveRequest(orgId, regId)
        .pipe(take(1))
        .subscribe({
          next: () => this.updateUIAfterAction(n, this.RegistrationStatus.ACCEPTED),
          error: (err) => console.error(err),
        });
    }
  }

  onReject(n: OrgNotification) {
    const regId = n.registration_data?.id;
    const orgId = this.organization?.id;
    if (!regId) return;

    if (n.type === this.NotificationType.REGISTRATION && n.project_id) {
      this.orgProfileService
        .rejectProjectRegistration(n.project_id, regId)
        .pipe(take(1))
        .subscribe({
          next: () => this.updateUIAfterAction(n, this.RegistrationStatus.REJECTED),
          error: (err) => console.error(err),
        });
    } else if (n.type === this.NotificationType.JOININGORG) {
      this.orgProfileService
        .rejectOrganizationMember(regId)
        .pipe(take(1))
        .subscribe({
          next: () => this.updateUIAfterAction(n, this.RegistrationStatus.REJECTED),
          error: (err) => console.error(err),
        });
    } else if (n.type === this.NotificationType.LEAVE_REQUEST && orgId) {
      this.orgProfileService
        .rejectLeaveRequest(orgId, regId)
        .pipe(take(1))
        .subscribe({
          next: () => this.updateUIAfterAction(n, this.RegistrationStatus.REJECTED),
          error: (err) => console.error(err),
        });
    }
  }

  private updateUIAfterAction(n: OrgNotification, status: ProjectRegistrationStatus) {
    if (n.registration_data) {
      n.registration_data.status = status;
    }
    this.markAsRead(n.id);
    this.cdr.markForCheck();
  }
}
