import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reports } from './reports/reports';
import { MainInfo } from './main-info/main-info';
import { OrgData } from './org-data/org-data';
import { ListUsers } from './list-users/list-users';
import { FundraisingCampaignsOrg } from './fundraising-campaigns-org/fundraising-campaigns-org';
import { Activity } from './activity/activity';
import { Organization, OrgLocation, OrgMember, Report } from './profile-organization.model';
import { OrganizationProfileService } from './profile-organization.service';

@Component({
  selector: 'app-profile-organization',
  standalone: true,
  imports: [
    CommonModule,
    Reports,
    FundraisingCampaignsOrg,
    OrgData,
    ListUsers,
    MainInfo,
    Activity
  ],
  templateUrl: './profile-organization.html',
  styleUrl: './profile-organization.scss',
})
export class ProfileOrganization implements OnInit {
  organization: Organization | undefined;
  location: OrgLocation | undefined;
  members: OrgMember[] | undefined;
  reports: Report[] | undefined;

  constructor(private orgService: OrganizationProfileService) {}

  onLocationChange(updated: OrgLocation): void {
    this.location = updated;
  }

  ngOnInit(): void {
    const orgId = 4;

    this.orgService.getOrganization(orgId).subscribe({
      next: (data: Organization) => {
        this.organization = data;
        if (data.location) {
          this.location = data.location;
        }
      },
      error: (err: any) => console.error(err)
    });

    this.orgService.getOrgReports(orgId).subscribe({
      next: (data: Report[]) => this.reports = data,
      error: (err: any) => console.error(err)
    });

    this.orgService.getOrgMembers(orgId).subscribe({
      next: (data: OrgMember[]) => this.members = data,
      error: (err: any) => console.error(err)
    });

    this.orgService.getOrganization(orgId).subscribe({
      next: (data) => {
        console.log('Дані отримано:', data);
        this.organization = data;
      },
      error: (err) => {
        console.error('ПОМИЛКА ЗАПИТУ:', err);
      }
    });
  }
}
