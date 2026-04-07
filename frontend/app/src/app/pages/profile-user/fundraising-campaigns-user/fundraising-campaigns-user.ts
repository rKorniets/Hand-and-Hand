import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppUser, FundraisingCampaign } from '../profile-user.model';

@Component({
  selector: 'app-fundraising-campaigns-user',
  standalone: true,
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
