import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainInfo } from './main-info/main-info';
import { Activity } from './activity/activity';
import { Requests } from './requests/requests';
import { UserData } from './user-data/user-data';
import { Achievement } from './achievement/achievement';
import { FundraisingCampaignsUser } from './fundraising-campaigns-user/fundraising-campaigns-user';
import { UserProfileService } from './profile-user.service';
import { AppUser } from './profile-user.model';
import { AuthService } from '../auth/auth.service';
import { RouterLink } from '@angular/router';
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
export class ProfileUserComponent implements OnInit {
  user: AppUser | null = null;

  constructor(
    private profileUserService: UserProfileService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  get isVolunteer(): boolean {
    return this.user?.role === 'VOLUNTEER';
  }

  ngOnInit(): void {
    this.profileUserService.getUser().subscribe({
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
}
