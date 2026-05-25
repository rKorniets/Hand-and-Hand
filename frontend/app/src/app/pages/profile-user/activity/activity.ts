import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { AppUser } from '../profile-user.model';
import { UiHelperService } from '../toggleExpansion.service';

interface ActivityItem {
  id: number;
  title: string;
  description?: string | null;
  starts_at?: string | null;
}

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

  constructor(private uiHelper: UiHelperService) {}

  ngOnInit(): void {}

  toggleActivities(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
