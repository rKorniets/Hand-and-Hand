import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { MainInfo } from './main-info/main-info';
import { Activity } from './activity/activity';
import { Requests } from './requests/requests';
import { UserData } from './user-data/user-data';
import { Achievement } from './achievement/achievement';
import { FundraisingCampaignsUser } from './fundraising-campaigns-user/fundraising-campaigns-user';
import { UserProfileService } from './profile-user.service';
import { AppUser } from './profile-user.model';
import { AuthService } from '../auth/auth.service';
import { Message } from './message/message';

@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MainInfo,
    Activity,
    Requests,
    UserData,
    Achievement,
    FundraisingCampaignsUser,
    Message,
  ],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.scss',
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  user: AppUser | null = null;
  private routeSub: Subscription | null = null;

  constructor(
    private profileUserService: UserProfileService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  get isVolunteer(): boolean {
    return this.user?.role === 'VOLUNTEER';
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');

      if (userId) {
        this.loadUserProfile(+userId);
      } else {
        this.loadMyProfile();
      }
    });
  }

  private loadUserProfile(id: number): void {
    this.profileUserService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Помилка завантаження профілю за ID:', err),
    });
  }

  private loadMyProfile(): void {
    this.profileUserService.getUser().subscribe({
      next: (data) => {
        this.user = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Помилка завантаження власного профілю:', err),
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
  get isOwnProfile(): boolean {
    const paramId = this.route.snapshot.paramMap.get('id');
    return !paramId || +paramId === this.authService.getUserId();
  }
}
