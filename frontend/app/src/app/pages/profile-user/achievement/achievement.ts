import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppUser, Reward } from '../profile-user.model';
import { UiHelperService } from '../toggleExpansion.service';
import { UserProfileService } from '../profile-user.service';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-achievement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievement.html',
  styleUrl: './achievement.scss',
})
export class Achievement implements OnInit, OnDestroy {
  @Input() user: AppUser | undefined;

  rewards: Reward[] = [];
  isExpanded = false;
  private socketSub?: Subscription;

  constructor(
    private uiHelper: UiHelperService,
    private profileService: UserProfileService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.profileService.getRewards().subscribe({
      next: (data) => {
        this.rewards = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });

    this.initSocketListener();
  }

  private initSocketListener(): void {
    this.socketSub = this.socketService
      .listen<{ userId: number; achievement: Reward }>('achievementUnlocked')
      .subscribe((data) => {
        if (this.user && this.user.id === data.userId) {
          const alreadyExists = this.rewards.some((r) => r.id === data.achievement.id);

          if (!alreadyExists) {
            this.rewards = [data.achievement, ...this.rewards];
            this.cdr.detectChanges();
          }
        }
      });
  }

  toggleAchievements(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }

  getTrophyIcon(conditionCount?: number): string {
    switch (conditionCount) {
      case 10:
        return '🥉';
      case 20:
        return '🥈';
      case 50:
        return '🏆';
      default:
        return '🏅';
    }
  }

  ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
  }
}
