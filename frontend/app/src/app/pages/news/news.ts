import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewsContentComponent } from './news-content/news-content';
import { NewsPinnedComponent } from './news-pinned/news-pinned';
import { NewsItem } from './news.model';
import { NewsService } from './news.service';
import { FiltersComponent } from '../../components/category/category';
import { FilterConfig, FilterState } from '../../components/category/category.model';
import { AuthService } from '../auth/auth.service';
import { SocketService } from '../../services/socket.service';
import { PaginationComponent } from '../../components/pagination/pagination';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    NewsPinnedComponent,
    NewsContentComponent,
    FiltersComponent,
    PaginationComponent,
  ],
  templateUrl: './news.html',
  styleUrls: ['./news.scss'],
})
export class NewsComponent implements OnInit, OnDestroy {
  pinnedNews: NewsItem[] = [];
  regularNews: NewsItem[] = [];
  canCreateNews = false;
  loading = false;
  error = false;

  currentPage = 1;
  readonly limit = 5;
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

  private subs: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data['data'];
    this.pinnedNews = data.pinned;
    this.regularNews = data.regular;
    this.hasNextPage = data.regular.length === this.limit;
    const role = this.authService.getRole();
    this.canCreateNews = role === 'ORGANIZATION' || role === 'ADMIN';
    this.cdr.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.initSocketListeners();
  }

  private initSocketListeners(): void {
    const createSub = this.socketService.listen<NewsItem>('newsCreated').subscribe((newNews) => {
      if (newNews.is_pinned) {
        this.pinnedNews = [newNews, ...this.pinnedNews];
        this.cdr.detectChanges();
      } else if (this.currentPage === 1) {
        this.regularNews = [newNews, ...this.regularNews];
        if (this.regularNews.length > this.limit) {
          this.regularNews.pop();
          this.hasNextPage = true;
        }
        this.cdr.detectChanges();
      }
    });

    const updateSub = this.socketService
      .listen<NewsItem>('newsUpdated')
      .subscribe((updatedNews) => {
        let changed = false;

        const regularIndex = this.regularNews.findIndex((n) => n.id === updatedNews.id);
        if (regularIndex !== -1) {
          this.regularNews[regularIndex] = { ...this.regularNews[regularIndex], ...updatedNews };
          changed = true;
        }

        const pinnedIndex = this.pinnedNews.findIndex((n) => n.id === updatedNews.id);
        if (pinnedIndex !== -1) {
          this.pinnedNews[pinnedIndex] = { ...this.pinnedNews[pinnedIndex], ...updatedNews };
          changed = true;
        }

        if (changed) {
          this.cdr.detectChanges();
        }
      });

    const deleteSub = this.socketService.listen<{ id: number }>('newsDeleted').subscribe((data) => {
      let changed = false;

      const initialRegularLength = this.regularNews.length;
      this.regularNews = this.regularNews.filter((n) => n.id !== data.id);
      if (this.regularNews.length !== initialRegularLength) changed = true;

      const initialPinnedLength = this.pinnedNews.length;
      this.pinnedNews = this.pinnedNews.filter((n) => n.id !== data.id);
      if (this.pinnedNews.length !== initialPinnedLength) changed = true;

      if (changed) this.cdr.detectChanges();
    });

    this.subs.add(createSub);
    this.subs.add(updateSub);
    this.subs.add(deleteSub);
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
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
