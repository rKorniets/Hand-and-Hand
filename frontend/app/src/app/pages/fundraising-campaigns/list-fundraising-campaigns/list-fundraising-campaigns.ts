import { Component, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FundraisingCampaignItem} from '../fundraising-campaings.model';

@Component({
  selector: 'app-list-fundraising-campaigns',
  imports: [CommonModule],
  templateUrl: './list-fundraising-campaigns.html',
  styleUrl: './list-fundraising-campaigns.scss',
})
export class ListFundraisingCampaigns {
  @Input() fundraisingCampaignItem: FundraisingCampaignItem[] = [];
}
