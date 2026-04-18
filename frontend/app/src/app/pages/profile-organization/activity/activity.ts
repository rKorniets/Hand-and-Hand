import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, SlicePipe, CommonModule } from "@angular/common";
import { ActivityItem, Organization } from '../profile-organization.model';
import { RouterLink } from '@angular/router';
import { OrganizationProfileService } from '../profile-organization.service';
import { UiHelperService } from '../../profile-user/toggleExpansion.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [DatePipe, SlicePipe, RouterLink, CommonModule],
  templateUrl: './activity.html',
  styleUrl: './activity.scss',
})
export class Activity implements OnInit {
  @Input() organization: Organization | null = null;

  activities: ActivityItem[] = [];
  isExpanded: boolean = false;

  constructor(
    private uiHelper: UiHelperService,
    private orgService: OrganizationProfileService
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  private loadActivities(): void {
    if (this.organization?.id) {
      this.orgService.getOrgActivities(this.organization.id).subscribe({
        next: (data) => {
          this.activities = data;
        },
        error: (err) => console.error('Помилка завантаження активностей:', err),
      });
    }
  }

  toggleActivities(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
