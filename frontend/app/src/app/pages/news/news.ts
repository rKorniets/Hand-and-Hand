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
  allRegularNews: NewsItem[] = [];
  regularNews: NewsItem[] = [];
  canCreateNews = false;
  loading = false;
  error = false;

  currentPage = 1;
  readonly limit = 10;
  totalPagesCount = 1;

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
    this.allRegularNews = data.regular;
    this.totalPagesCount = Math.ceil(this.allRegularNews.length / this.limit);
    this.updatePage();
    const role = this.authService.getRole();
    this.canCreateNews = role === 'ORGANIZATION' || role === 'ADMIN';
    this.cdr.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.initSocketListeners();
  }

  private updatePage(): void {
    const start = (this.currentPage - 1) * this.limit;
    this.regularNews = this.allRegularNews.slice(start, start + this.limit);
  }

  private initSocketListeners(): void {
    const createSub = this.socketService.listen<NewsItem>('newsCreated').subscribe((newNews) => {
      if (newNews.is_pinned) {
        this.pinnedNews = [newNews, ...this.pinnedNews];
      } else {
        this.allRegularNews = [newNews, ...this.allRegularNews];
        this.totalPagesCount = Math.ceil(this.allRegularNews.length / this.limit);
        this.updatePage();
      }
      this.cdr.detectChanges();
    });

    const updateSub = this.socketService
      .listen<NewsItem>('newsUpdated')
      .subscribe((updatedNews) => {
        let changed = false;

        const regularIndex = this.allRegularNews.findIndex((n) => n.id === updatedNews.id);
        if (regularIndex !== -1) {
          this.allRegularNews[regularIndex] = {
            ...this.allRegularNews[regularIndex],
            ...updatedNews,
          };
          this.updatePage();
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

      const initialLength = this.allRegularNews.length;
      this.allRegularNews = this.allRegularNews.filter((n) => n.id !== data.id);
      if (this.allRegularNews.length !== initialLength) {
        this.totalPagesCount = Math.ceil(this.allRegularNews.length / this.limit);
        this.updatePage();
        changed = true;
      }

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
    this.cdr.detectChanges();

    this.newsService
      .getNews(1000, 0, false, this.activeFilters.search, this.activeFilters.categories)
      .subscribe({
        next: (response) => {
          this.allRegularNews = response.data;
          this.totalPagesCount = Math.ceil(this.allRegularNews.length / this.limit);
          this.updatePage();
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
    this.updatePage();
    this.cdr.detectChanges();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
