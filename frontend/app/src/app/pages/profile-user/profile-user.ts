import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { user_role_enum } from '@prisma/client';
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
  isOwnProfile = false;
  private routeSub: Subscription | null = null;
  protected readonly UserRole = user_role_enum;

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
    this.routeSub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const userId = params.get('id');
          const myId = this.authService.getUserId();

          if (userId) {
            this.isOwnProfile = Number(userId) === myId;
            return this.profileUserService.getUserById(+userId);
          } else {
            this.isOwnProfile = true;
            return this.profileUserService.getUser();
          }
        }),
      )
      .subscribe({
        next: (data) => {
          this.user = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Помилка завантаження профілю:', err),
      });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
