import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUser, Reward } from '../profile-user.model';
import { UiHelperService } from '../toggleExpansion.service';
import { UserProfileService } from '../profile-user.service';

@Component({
  selector: 'app-achievement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievement.html',
  styleUrl: './achievement.scss',
})
export class Achievement implements OnInit {
  @Input() user: AppUser | undefined;

  rewards: Reward[] = [];
  isExpanded = false;

  constructor(
    private uiHelper: UiHelperService,
    private profileService: UserProfileService,
  ) {}

  ngOnInit(): void {
    this.profileService.getRewards().subscribe({
      next: (data) => (this.rewards = data),
      error: (err) => console.error(err),
    });
  }

  toggleAchievements(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
