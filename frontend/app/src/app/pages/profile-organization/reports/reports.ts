import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Organization, Report } from '../profile-organization.model';
import { OrganizationProfileService } from '../profile-organization.service';
import { UiHelperService } from '../../profile-user/toggleExpansion.service';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DatePipe, SlicePipe, RouterLink],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit {
  @Input() organization: Organization | null = null;

  @Input() reports: Report[] = [];

  isExpanded = false;

  constructor(
    private uiHelper: UiHelperService,
    private orgService: OrganizationProfileService
  ) {}

  ngOnInit(): void {
    if (this.organization && (!this.reports || this.reports.length === 0)) {
      this.orgService.getOrgReports(this.organization.id).subscribe((data: Report[]) => {
        this.reports = data;
      });
    }
  }

  getOrgReports(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
