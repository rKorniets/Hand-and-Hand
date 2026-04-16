import { Component, OnInit } from '@angular/core';
import { MainInfo } from './main-info/main-info';
import { Activity } from './activity/activity';
import { Requests } from './requests/requests';
import { UserData } from './user-data/user-data';
import { Achievement } from './achievement/achievement';
import { AppUser } from './profile-user.model';
import { FundraisingCampaignsUser } from './fundraising-campaigns-user/fundraising-campaigns-user';
import { UserProfileService } from './profile-user.service';

@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [MainInfo, Activity, Requests, UserData, Achievement, FundraisingCampaignsUser],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.scss',
})
export class ProfileUserComponent implements OnInit {
  user: AppUser | undefined;

  constructor(private profileUserService: UserProfileService) {}

  get isVolunteer(): boolean {
    return this.user?.role === 'VOLUNTEER';
  }

  ngOnInit(): void {
    this.profileUserService.getUser().subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error(err),
    });
  }
}
