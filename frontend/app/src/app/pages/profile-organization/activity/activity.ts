import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { ActivityItem, Organization } from '../profile-organization.model';
import { RouterLink } from '@angular/router';
import { OrganizationProfileService } from '../profile-organization.service';
import { UiHelperService } from '../../profile-user/toggleExpansion.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [DatePipe, RouterLink, CommonModule],
  templateUrl: './activity.html',
  styleUrl: './activity.scss',
})
export class Activity implements OnInit, OnChanges {
  @Input() organization: Organization | null = null;

  activities: ActivityItem[] = [];
  visibleActivities: ActivityItem[] = [];
  isExpanded = false;

  constructor(
    private uiHelper: UiHelperService,
    private orgService: OrganizationProfileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organization'] && this.organization?.id) {
      this.loadActivities();
    }
  }

  private loadActivities(): void {
    if (!this.organization?.id) return;

    this.orgService.getOrgActivities(this.organization.id).subscribe({
      next: (data) => {
        this.activities = data;
        this.visibleActivities = data.slice(0, 5);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Помилка завантаження активностей:', err),
    });
  }

  toggleActivities(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
    this.visibleActivities = this.isExpanded ? this.activities : this.activities.slice(0, 5);
    this.cdr.detectChanges();
  }
}
