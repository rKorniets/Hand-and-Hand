import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categories } from './categories/categories';
import { ListFundraisingCampaigns } from './list-fundraising-campaigns/list-fundraising-campaigns';
import { FundraisingCampaignsService } from './fundraising-campaigns.service';
import { FundraisingCampaignItem } from './fundraising-campaings.model';

@Component({
  selector: 'app-fundraising-campaigns',
  standalone: true,
  imports: [CommonModule, Categories, ListFundraisingCampaigns],
  templateUrl: './fundraising-campaigns.html',
  styleUrl: './fundraising-campaigns.scss',
})
export class FundraisingCampaigns implements OnInit {
  private fundraisingService = inject(FundraisingCampaignsService);
  private cdr = inject(ChangeDetectorRef);

  campaignsList: FundraisingCampaignItem[] = [];

  limit: number = 4;
  totalPages: number = 1;

  ngOnInit() {
    this.loadCampaigns(1);
  }

  loadCampaigns(page: number) {
    const skip = (page - 1) * this.limit;

    this.fundraisingService.getCampaigns(this.limit, skip).subscribe({
      next: (response) => {
        this.campaignsList = response.data;

        this.totalPages = Math.ceil(response.total / this.limit) || 1;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ПОМИЛКА:', err);
      },
    });
  }

  onPageChanged(newPage: number) {
    this.loadCampaigns(newPage);
  }
}
