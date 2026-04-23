import { Component, OnInit } from '@angular/core';
import { ListFundraisingCampaigns } from './list-fundraising-campaigns/list-fundraising-campaigns';
import { FiltersComponent } from '../../components/category/category';
import { FilterConfig, FilterState } from '../../components/category/category.model';
import { FundraisingCampaignItem } from './fundraising-campaings.model';
import { FundraisingService } from './fundaising-campaings.service';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categories } from './categories/categories';
import { ListFundraisingCampaigns } from './list-fundraising-campaigns/list-fundraising-campaigns';
import { FundraisingCampaignsService } from './fundraising-campaigns.service';
import { FundraisingCampaignItem } from './fundraising-campaings.model';

@Component({
  selector: 'app-fundraising-campaigns',
  standalone: true,
  imports: [FiltersComponent, ListFundraisingCampaigns],
  imports: [CommonModule, Categories, ListFundraisingCampaigns],
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
      .getCampaigns(this.limit, skip, this.activeFilters.search, this.activeFilters.categories)
      .subscribe({
        next: (data: FundraisingCampaignItem[]) => {
          this.campaigns = data;
          this.hasNextPage = data.length === this.limit;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
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
