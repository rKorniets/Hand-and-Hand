import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppUser, FundraisingCampaign } from '../profile-user.model';
import {UiHelperService} from '../toggleExpansion.service';
import { UserProfileService } from '../profile-user.service';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppUser, FundraisingCampaign } from '../profile-user.model';

@Component({
  selector: 'app-fundraising-campaigns-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fundraising-campaigns-user.html',
  styleUrl: './fundraising-campaigns-user.scss'
})
export class FundraisingCampaignsUser implements OnInit {
  @Input() user: AppUser | undefined;

  fundraisingCampaignItem: FundraisingCampaign[] = [];
  isExpanded: boolean = false;

  constructor(
    private uiHelper: UiHelperService,
    private profileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.getFundraisingCampaigns().subscribe({
      next: (data) => this.fundraisingCampaignItem = data,
      error: (err) => console.error(err),
    });
  }

  toggleFundraisingCampaigns(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  imports: [CommonModule, RouterLink],
  templateUrl: './fundraising-campaigns-user.html',
  styleUrl: './fundraising-campaigns-user.scss',
})
export class FundraisingCampaignsUser {
  @Input() user: AppUser | null = null;
  isExpanded: boolean = false;

  // Дані для перевірки
  @Input() fundraisingCampaignItem: FundraisingCampaign[] = [
    {
      id: 1,
      title: 'Смак дому: Свіжі овочі та фрукти для самотніх',
      description: 'Збір на їжу для людей похилого віку у пансіонати',
      volunteer_profile: {
        first_name: 'Олексій',
        last_name: 'Петренко'
      }
    },
    {
      id: 2,
      title: 'Аптечки для волонтерів',
      description: 'Закупівля медикаментів для виїздів у прифронтові зони',
      volunteer_profile: {
        first_name: 'Олексій',
        last_name: 'Петренко'
      }
    },
    {
      id: 3,
      title: 'Ремонт притулку "Хвостики"',
      description: 'Потрібні кошти на заміну вікон у вольєрах перед зимою',
      volunteer_profile: {
        first_name: 'Олексій',
        last_name: 'Петренко'
      }
    }
  ];
  toggleFundraisingCampaigns(target: HTMLElement) {
    this.isExpanded = !this.isExpanded;

    setTimeout(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }
}
