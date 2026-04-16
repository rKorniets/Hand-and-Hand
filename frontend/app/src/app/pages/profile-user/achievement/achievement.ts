import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUser, Reward } from '../profile-user.model';
import { UiHelperService } from '../toggleExpansion.service';
import { UserProfileService } from '../profile-user.service';
import { Component, Input } from '@angular/core';
import { AppUser, Reward } from '../profile-user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievement.html',
  styleUrl: './achievement.scss',
})
export class Achievement implements OnInit {
  @Input() user: AppUser | undefined;
  @Input() rewards: Reward[] = [];

  isExpanded = false;

  constructor(
    private uiHelper: UiHelperService,
    private profileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.getRewards().subscribe({
      next: (data) => this.rewards = data,
      error: (err) => console.error(err),
    });
  }



  toggleAchievements(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
export class Achievement {
  @Input() user?: AppUser;

  isExpanded: boolean = false;

  rewards: Reward[] = [
    { id: 1, title: 'Волонтер з досвідом', description: 'Надається за активну участь', threshold_points: 500, is_active: true, created_at: new Date() },
    { id: 2, title: 'Супергерой', description: 'Ти допоміг усім!', threshold_points: 1000, is_active: true, created_at: new Date() },
    { id: 3, title: 'Активіст', description: 'За 10 відвіданих подій', threshold_points: 300, is_active: true, created_at: new Date() },
    { id: 4, title: 'Меценат', description: 'За допомогу притулкам', threshold_points: 1500, is_active: true, created_at: new Date() },
  ];

  toggleAchievements() {
    this.isExpanded = !this.isExpanded;
  }
}
