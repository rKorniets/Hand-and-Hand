import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { AppUser, ActivityItem } from '../profile-user.model';
import { UiHelperService } from '../toggleExpansion.service';
import { UserProfileService } from '../profile-user.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [DatePipe, RouterLink, CommonModule, RouterModule],
  templateUrl: './activity.html',
  styleUrl: './activity.scss',
})
export class Activity implements OnInit {
  @Input() user: AppUser | undefined;

  activities: ActivityItem[] = [];
  isExpanded: boolean = false;

  constructor(
    private uiHelper: UiHelperService,
    private profileService: UserProfileService,
  ) {}

  ngOnInit(): void {
    this.profileService.getUserActivities().subscribe({
      next: (data) => (this.activities = data),
      error: (err) => console.error(err),
    });
  }

  toggleActivities(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
