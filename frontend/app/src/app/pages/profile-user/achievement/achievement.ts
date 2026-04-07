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
