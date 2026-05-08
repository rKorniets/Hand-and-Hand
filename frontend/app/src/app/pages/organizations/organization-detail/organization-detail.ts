import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrganizationService } from '../organization.service';
import { AuthService } from '../../auth/auth.service';
import {
  Organization,
  Member,
  OrgEvent,
  OrgReport,
  OrgLocation,
  FundraisingCampaign,
  MembershipRequest,
  MembershipStatus,
  UserRole,
} from '../organizations.model';

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './organization-detail.html',
  styleUrl: './organization-detail.scss',
})
export class OrganizationDetailComponent implements OnInit {
  organization: Organization | null = null;
  location: OrgLocation | null = null;
  protected readonly MembershipStatus = MembershipStatus;

  myMembership: MembershipRequest | null = null;
  isLoggedIn = false;

  loading = true;
  error = false;

  isExpanded = false;
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
      if (id) {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.loadOrganization(id);
        this.checkMembership(id);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  private loadOrganization(id: number): void {
    this.loading = true;
    this.error = false;

    forkJoin({
      mainInfo: this.orgService.getOrganizationById(id),
      events: this.orgService.getOrganizationProjects(id),
      fundraising: this.orgService.getOrganizationFundraising(id),
      members: this.orgService.getOrganizationMembers(id),
      reports: this.orgService.getOrganizationReports(id),
    }).subscribe({
      next: (res) => {
        this.organization = {
          ...res.mainInfo,
          events: res.events,
          fundraising_campaigns: res.fundraising,
          members: res.members,
          reports: res.reports,
        };

        this.location = res.mainInfo.location || null;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Помилка завантаження даних організації:', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private checkMembership(id: number): void {
    if (this.isLoggedIn) {
      this.orgService.getMyMembershipStatus(id).subscribe({
        next: (res) => {
          this.myMembership = res;
          this.cdr.detectChanges();
        },
        error: () => {
          this.myMembership = null;
          this.cdr.detectChanges();
        },
      });
    }
  }

  joinOrganization(): void {
    if (!this.organization || !this.isLoggedIn) return;

    this.orgService.joinOrganization(this.organization.id).subscribe({
      next: (res) => {
        this.myMembership = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Помилка приєднання:', err),
    });
  }

  getJoinButtonText(): string {
    const status = this.myMembership?.status;
    const rejections = this.myMembership?.rejection_count || 0;

    if (status === MembershipStatus.PENDING) return 'Заявка на розгляді';
    if (status === MembershipStatus.ACCEPTED) return 'Ви вже учасник';
    if (status === MembershipStatus.REJECTED) {
      return rejections >= 3 ? 'Доступ заблоковано' : 'Подати ще раз';
    }
    return 'Приєднатися до організації';
  }

  isJoinDisabled(): boolean {
    const status = this.myMembership?.status;
    const rejections = this.myMembership?.rejection_count || 0;

    return (
      status === MembershipStatus.PENDING || status === MembershipStatus.ACCEPTED || rejections >= 3
    );
  }

  get activities(): OrgEvent[] {
    return this.organization?.events || [];
  }

  get visibleActivities(): OrgEvent[] {
    return this.isExpanded ? this.activities : this.activities.slice(0, 5);
  }

  get fundraisingCampaignItem(): FundraisingCampaign[] {
    return this.organization?.fundraising_campaigns || [];
  }

  get reports(): OrgReport[] {
    return this.organization?.reports || [];
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
    this.isExpanded = !this.isExpanded;
  }

  getOrgReports(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  getFullName(member: Member): string {
    if (!member) return 'Анонімний користувач';
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Користувач';
  }
  get canSeeJoinBlock(): boolean {
    const role = this.authService.getRole();
    return role !== UserRole.ORGANIZATION;
  }
}
