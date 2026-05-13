import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private orgService: OrganizationProfileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.organization && (!this.reports || this.reports.length === 0)) {
      this.orgService.getOrgReports(this.organization.id).subscribe((res: Report[]) => {
        this.reports = res;
        this.cdr.detectChanges();
      });
    }
  }

  openFile(event: Event, url: string): void {
    event.preventDefault();
    event.stopPropagation();

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Файл відсутній для цього звіту');
    }
  }

  getOrgReports(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
