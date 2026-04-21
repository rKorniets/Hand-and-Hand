import { Component, OnInit } from '@angular/core';
import { ListFundraisingCampaigns } from './list-fundraising-campaigns/list-fundraising-campaigns';
import { FiltersComponent } from '../../components/category/category';
import { FilterConfig, FilterState } from '../../components/category/category.model';
import { FundraisingCampaignItem } from './fundraising-campaings.model';
import { FundraisingService } from './fundaising-campaings.service';

@Component({
  selector: 'app-fundraising-campaigns',
  standalone: true,
  imports: [FiltersComponent, ListFundraisingCampaigns],
  templateUrl: './fundraising-campaigns.html',
  styleUrl: './fundraising-campaigns.scss',
})
export class FundraisingCampaigns implements OnInit {
  campaigns: FundraisingCampaignItem[] = [];
  loading = false;
  error = false;

  readonly limit = 10;
  currentPage = 1;
  hasNextPage = false;

  readonly filterConfig: FilterConfig = {
    showSearch: true,
    categoryContext: 'fundraising',
    showStatus: true,
  };

  activeFilters: FilterState = {
    search: '',
    categories: [],
    status: [],
    dateFrom: '',
    dateTo: '',
    city: '',
  };

  constructor(private fundraisingService: FundraisingService) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  onFiltersChanged(filters: FilterState): void {
    this.activeFilters = filters;
    this.currentPage = 1;
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    const skip = (this.currentPage - 1) * this.limit;

    this.fundraisingService
      .getCampaigns(
        this.limit,
        skip,
        this.activeFilters.search,
        this.activeFilters.categories,
        this.activeFilters.status,
      )
      .subscribe({
        next: (data) => {
          this.campaigns = data;
          this.hasNextPage = data.length === this.limit;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
  }
}
