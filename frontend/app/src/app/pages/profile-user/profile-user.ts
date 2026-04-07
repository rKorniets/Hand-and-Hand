import {Component, OnInit} from '@angular/core';
import { MainInfo } from './main-info/main-info';
import { Activity } from './activity/activity';
import { Requests } from './requests/requests';
import { UserData } from './user-data/user-data'
import { Achievement } from './achievement/achievement';
import { AppUser } from './profile-user.model';
import { FundraisingCampaignsUser } from './fundraising-campaigns-user/fundraising-campaigns-user';

@Component({
  selector: 'app-profile-user',
  imports: [ MainInfo, Activity, Requests, UserData, Achievement, FundraisingCampaignsUser],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.scss',
})
export class ProfileUserComponent implements OnInit {
  user: AppUser = {
    id: 1,
    email: 'rayangosling@gmail.com',
    password_hash: '',
    role: 'VOLUNTEER',
    status: 'ACTIVE',
    created_at: new Date('2026-03-13T10:00:00Z'),
    points: 6767,
    first_name: 'Раян',
    last_name: 'Гослінг',
    city: 'Львів',
    joined_organization_id: 101,
    joined_organization: {
      id: 101,
      name: 'ГО Нитка часу'
    }
  };
  get isVolunteer(): boolean {
    return this.user?.role === 'VOLUNTEER';
  }

  ngOnInit(): void {}
}
