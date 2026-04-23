import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Reports } from './reports/reports';
import { MainInfo } from './main-info/main-info';
import { OrgData } from './org-data/org-data';
import { ListUsers } from './list-users/list-users';
import { FundraisingCampaignsOrg } from './fundraising-campaigns-org/fundraising-campaigns-org';
import { Activity } from './activity/activity';
import { Organization, OrgLocation, Report } from './profile-organization.model';
import { OrganizationProfileService } from './profile-organization.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile-organization',
  standalone: true,
  imports: [CommonModule, Reports, FundraisingCampaignsOrg, OrgData, ListUsers, MainInfo, Activity],
  templateUrl: './profile-organization.html',
  styleUrl: './profile-organization.scss',
})
export class ProfileOrganization implements OnInit {
  organization: Organization | null = null;
  location: OrgLocation | undefined;
  reports: Report[] = [];

  constructor(
    private orgService: OrganizationProfileService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    const request$ = idParam
      ? this.orgService.getOrganizationById(+idParam)
      : this.orgService.getOrganization();

    request$.subscribe({
      next: (data: Organization) => {
        if (data) {
          this.organization = data;
          this.location = data.location;
          this.loadReports(data.id);
        } else {
          console.warn('Сервер повернув null. Перевірте базу даних.');
        }
        this.cdr.detectChanges();
      },
      error: (err: unknown) => console.error('Помилка завантаження профілю:', err),
    });
  }

  private loadReports(orgId: number): void {
    this.orgService.getOrgReports(orgId).subscribe({
      next: (reports: Report[]) => {
        this.reports = reports || [];
        this.cdr.detectChanges();
      },
      error: (err: unknown) => console.error('Помилка завантаження звітів:', err),
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
