import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFundraisingCampaigns } from './list-fundraising-campaigns/list-fundraising-campaigns';
import { FiltersComponent } from '../../components/category/category';
import { FilterConfig, FilterState } from '../../components/category/category.model';
import { FundraisingCampaignItem } from './fundraising-campaings.model';
import { FundraisingCampaignsService } from './fundraising-campaigns.service';

@Component({
  selector: 'app-fundraising-campaigns',
  standalone: true,
  imports: [CommonModule, FiltersComponent, ListFundraisingCampaigns],
  templateUrl: './fundraising-campaigns.html',
  styleUrl: './fundraising-campaigns.scss',
})
export class FundraisingCampaigns implements OnInit {
  private fundraisingService = inject(FundraisingCampaignsService);
  private cdr = inject(ChangeDetectorRef);

  campaignsList: FundraisingCampaignItem[] = [];
  loading = false;
  error = false;

  limit = 4;
  totalPages = 1;
  currentPage = 1;

  readonly filterConfig: FilterConfig = {
    showSearch: true,
    categoryContext: 'fundraising',
    showStatus: false,
  };

  activeFilters: FilterState = {
    search: '',
    categories: [],
    status: [],
    dateFrom: '',
    dateTo: '',
    city: '',
  };

  ngOnInit() {
    this.loadCampaigns(1);
  }

  onFiltersChanged(filters: FilterState): void {
    this.activeFilters = filters;
    this.currentPage = 1;
    this.loadCampaigns(1);
  }

  loadCampaigns(page: number) {
    this.loading = true;
    const skip = (page - 1) * this.limit;

    this.fundraisingService.getCampaigns(this.limit, skip).subscribe({
      next: (response) => {
        this.campaignsList = response.data;
        this.totalPages = Math.ceil(response.total / this.limit) || 1;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ПОМИЛКА:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.loadCampaigns(newPage);
  }
}
