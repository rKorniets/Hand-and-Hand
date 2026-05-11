import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, take } from 'rxjs';
import { OrganizationService } from '../organization.service';
import { AuthService } from '../../auth/auth.service';
import {
  Organization,
  Member,
  OrgEvent,
  OrgLocation,
  MembershipRequest,
  MembershipStatus,
  MembershipDirection,
  UserRole,
} from '../organizations.model';

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './organization-detail.html',
  styleUrl: './organization-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationDetailComponent implements OnInit {
  organization: Organization | null = null;
  location: OrgLocation | null = null;

  protected readonly MembershipStatus = MembershipStatus;
  protected readonly MembershipDirection = MembershipDirection;

  myMembership: MembershipRequest | null = null;
  isLoggedIn = false;
  loading = true;
  error = false;

  activitiesExpanded = false;
  expanded = false;
  collapseCount = 3;

  constructor(
    private route: ActivatedRoute,
    private orgService: OrganizationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      if (!id) {
        this.handleError();
        return;
      }
      this.isLoggedIn = this.authService.isLoggedIn();
      this.loadOrganization(id);
      if (this.isLoggedIn) this.checkMembership(id);
    });
  }

  private loadOrganization(id: number): void {
    this.loading = true;
    forkJoin({
      mainInfo: this.orgService.getOrganizationById(id),
      events: this.orgService.getOrganizationProjects(id),
      fundraising: this.orgService.getOrganizationFundraising(id),
      members: this.orgService.getOrganizationMembers(id),
      reports: this.orgService.getOrganizationReports(id),
    })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.organization = {
            ...res.mainInfo,
            events: res.events,
            fundraising_campaigns: res.fundraising,
            members: res.members,
            reports: res.reports,
          };
          this.location = res.mainInfo.location ?? null;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => this.handleError(),
      });
  }

  private handleError(): void {
    this.error = true;
    this.loading = false;
    this.cdr.markForCheck();
  }

  private checkMembership(id: number): void {
    this.orgService
      .getMyMembershipStatus(id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.myMembership = res;
          this.cdr.markForCheck();
        },
        error: () => {
          this.myMembership = null;
          this.cdr.markForCheck();
        },
      });
  }

  joinOrganization(): void {
    if (!this.organization || this.isJoinDisabled) return;
    this.orgService
      .joinOrganization(this.organization.id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.myMembership = res;
          this.cdr.markForCheck();
        },
      });
  }

  cancelRequest(): void {
    if (!this.organization) return;
    this.orgService
      .cancelMembershipRequest(this.organization.id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.myMembership = res;
          this.cdr.markForCheck();
        },
      });
  }

  leaveOrganization(): void {
    if (!this.organization || !confirm('Ви впевнені?')) return;
    this.orgService
      .leaveOrganization(this.organization.id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.myMembership = res;
          this.cdr.markForCheck();
        },
      });
  }

  get membershipStatusText(): string {
    const status = this.myMembership?.status;

    if (this.isMaxAttemptsReached) {
      return 'Доступ обмежено (ліміт спроб)';
    }

    switch (status) {
      case MembershipStatus.PENDING:
        return 'Заявка на розгляді';
      case MembershipStatus.ACCEPTED:
        return 'Ви учасник';
      case MembershipStatus.REJECTED:
        return 'Заявку відхилено';
      default:
        return 'Приєднатися до організації';
    }
  }

  get attemptsLeft(): number {
    return 3 - (this.myMembership?.attempt_count || 0);
  }

  get isMaxAttemptsReached(): boolean {
    const status = this.myMembership?.status;
    const count = this.myMembership?.attempt_count || 0;

    return (
      status === MembershipStatus.REJECTED || (count >= 3 && status !== MembershipStatus.ACCEPTED)
    );
  }

  get isJoinDisabled(): boolean {
    const status = this.myMembership?.status;
    return (
      status === MembershipStatus.PENDING ||
      status === MembershipStatus.ACCEPTED ||
      this.isMaxAttemptsReached
    );
  }

  get showJoinButton(): boolean {
    const status = this.myMembership?.status;
    const direction = this.myMembership?.direction;

    const isPending = status === MembershipStatus.PENDING;
    const isAccepted = status === MembershipStatus.ACCEPTED;
    const isLeaveCancelled =
      status === MembershipStatus.CANCELLED && direction === MembershipDirection.LEAVE;

    return !this.isMaxAttemptsReached && !isAccepted && !isPending && !isLeaveCancelled;
  }

  get showCancelButton(): boolean {
    return (
      this.myMembership?.status === MembershipStatus.PENDING &&
      this.myMembership?.direction === MembershipDirection.REQUEST
    );
  }

  get showLeaveButton(): boolean {
    return this.myMembership?.status === MembershipStatus.ACCEPTED;
  }

  get canSeeJoinBlock(): boolean {
    return this.authService.getRole() !== UserRole.ORGANIZATION;
  }

  get activities(): OrgEvent[] {
    return this.organization?.events || [];
  }

  get visibleActivities(): OrgEvent[] {
    return this.activitiesExpanded ? this.activities : this.activities.slice(0, 5);
  }

  get members(): Member[] {
    return this.organization?.members || [];
  }

  get visibleMembers(): Member[] {
    return this.expanded ? this.members : this.members.slice(0, this.collapseCount);
  }

  get description(): string {
    return this.organization?.description || '';
  }

  toggleActivities(): void {
    this.activitiesExpanded = !this.activitiesExpanded;
    this.cdr.markForCheck();
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
    this.cdr.markForCheck();
  }

  getFullName(member: Member): string {
    const name = `${member.first_name || ''} ${member.last_name || ''}`.trim();
    return name || 'Користувач';
  }
}
