import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundraisingCampaignItem } from '../fundraising-campaings.model';

@Component({
  selector: 'app-list-fundraising-campaigns',
  imports: [CommonModule],
  templateUrl: './list-fundraising-campaigns.html',
  styleUrl: './list-fundraising-campaigns.scss',
})
export class ListFundraisingCampaigns {
  @Input() fundraisingCampaignItem: FundraisingCampaignItem[] = [];

  getOrganizer(campaign: FundraisingCampaignItem): string {
    if (campaign.organization_profile?.title) {
      return campaign.organization_profile.title;
    }

    const first = campaign.volunteer_profile?.first_name ?? '';
    const last = campaign.volunteer_profile?.last_name ?? '';
    return `${first} ${last}`.trim();
  }
}
