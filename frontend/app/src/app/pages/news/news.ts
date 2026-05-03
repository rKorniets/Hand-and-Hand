import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NewsContentComponent } from './news-content/news-content';
import { NewsPinnedComponent } from './news-pinned/news-pinned';
import { NewsItem } from './news.model';
import { NewsService } from './news.service';
import { FiltersComponent } from '../../components/category/category';
import { FilterConfig, FilterState } from '../../components/category/category.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, NewsPinnedComponent, NewsContentComponent, FiltersComponent],
  templateUrl: './news.html',
  styleUrls: ['./news.scss'],
})
export class NewsComponent implements OnInit {
  pinnedNews: NewsItem[] = [];
  regularNews: NewsItem[] = [];
  isOrganization = false;
  loading = false;
  error = false;

  currentPage = 1;
  readonly limit = 10;
  hasNextPage = false;

  filterConfig: FilterConfig = {
    showSearch: true,
    categoryContext: 'news',
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
    private newsService: NewsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data['data'];
    this.pinnedNews = data.pinned;
    this.regularNews = data.regular;
    this.hasNextPage = data.regular.length === this.limit;
    this.isOrganization = this.authService.getRole() === 'ORGANIZATION';
    this.cdr.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onFiltersChanged(filters: FilterState): void {
    this.activeFilters = filters;
    this.currentPage = 1;
    this.loadRegular();
  }

  loadRegular(): void {
    this.loading = true;
    const skip = (this.currentPage - 1) * this.limit;

    this.newsService
      .getNews(this.limit, skip, false, this.activeFilters.search, this.activeFilters.categories)
      .subscribe({
        next: (data) => {
          this.regularNews = data;
          this.hasNextPage = data.length === this.limit;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = true;
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadRegular();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const last = this.hasNextPage ? this.currentPage + 1 : this.currentPage;

    if (last <= 5) {
      for (let i = 1; i <= last; i++) pages.push(i);
    } else {
      pages.push(1);
      if (this.currentPage > 3) pages.push(-1);
      for (
        let i = Math.max(2, this.currentPage - 1);
        i <= Math.min(last - 1, this.currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (this.currentPage < last - 2) pages.push(-1);
      pages.push(last);
    }

    return pages;
  }
}
