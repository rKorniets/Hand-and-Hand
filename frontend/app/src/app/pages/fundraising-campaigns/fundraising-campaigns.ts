import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from '../../components/category/category';
import { FilterConfig, FilterState } from '../../components/category/category.model';
import { ListFundraisingCampaigns } from './list-fundraising-campaigns/list-fundraising-campaigns';
import { FundraisingCampaignsService } from './fundraising-campaigns.service';
import { FundraisingCampaignItem } from './fundraising-campaings.model';

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

  limit: number = 4;
  currentPage = 1;
  totalPages: number = 1;

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
    this.loadCampaigns(1);
  }

  loadCampaigns(page: number) {
    this.currentPage = page;
    this.loading = true;
    this.error = false;
    const skip = (page - 1) * this.limit;

    this.fundraisingService
      .getCampaigns(
        this.limit,
        skip,
        this.activeFilters.search,
        this.activeFilters.categories,
      )
      .subscribe({
        next: (response) => {
          this.campaignsList = response.data;
          this.totalPages = Math.ceil(response.total / this.limit) || 1;
          this.loading = false;
          this.error = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ПОМИЛКА:', err);
          this.error = true;
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  onPageChanged(newPage: number) {
    this.loadCampaigns(newPage);
  }
}
