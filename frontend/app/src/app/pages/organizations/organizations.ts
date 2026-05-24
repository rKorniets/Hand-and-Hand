import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListOrgComponent } from './list-org/list-org';
import { FiltersComponent } from '../../components/category/category';
import { FilterConfig, FilterState } from '../../components/category/category.model';
import { Organization } from './organizations.model';
import { OrganizationService } from './organization.service';
import { PaginationComponent } from '../../components/pagination/pagination';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [FiltersComponent, ListOrgComponent, PaginationComponent],
  templateUrl: './organizations.html',
  styleUrl: './organizations.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsPage implements OnInit {
  organizations: Organization[] = [];
  loading = false;
  error = false;

  readonly limit = 10;
  currentPage = 1;
  hasNextPage = false;

  readonly filterConfig: FilterConfig = {
    showSearch: true,
    categoryContext: 'organizations',
    showCity: true,
  };

  activeFilters: FilterState = {
    search: '',
    categories: [],
    status: [],
    dateFrom: '',
    dateTo: '',
    city: '',
  };

  constructor(
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((res) => {
      const result = res['data'];
      const data = result?.data ?? result ?? [];
      this.organizations = [...data];
      this.hasNextPage = result?.hasNextPage ?? data.length === this.limit;
      this.cdr.markForCheck();
    });
  }

  onFiltersChanged(filters: FilterState): void {
    this.activeFilters = filters;
    this.currentPage = 1;
    this.loadOrganizations();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadOrganizations();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadOrganizations(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const skip = (this.currentPage - 1) * this.limit;

    this.organizationService
      .getOrganizations(this.limit, skip, this.activeFilters.search, this.activeFilters.categories)
      .subscribe({
        next: ({ data }) => {
          this.organizations = [...data];
          this.hasNextPage = data.length === this.limit;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = true;
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
