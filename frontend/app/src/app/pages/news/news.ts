import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsContentComponent } from './news-content/news-content';
import { NewsFilterComponent } from './news-filter/news-filter';
import { NewsPinnedComponent } from './news-pinned/news-pinned';
import { NewsItem } from './news.model';
import { NewsService } from './news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    NewsPinnedComponent,
    NewsContentComponent,
    NewsFilterComponent,
  ],
  templateUrl: './news.html',
  styleUrls: ['./news.scss'],
})
export class NewsComponent implements OnInit {
  pinnedNews: NewsItem[] = [];
  regularNews: NewsItem[] = [];
  loading = false;
  error = false;

  currentPage = 1;
  readonly limit = 10;
  hasNextPage = false;

  constructor(
    private newsService: NewsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPinned();
    this.loadRegular();
  }

  loadPinned(): void {
    this.newsService.getNews(10, 0, true).subscribe({
      next: (data) => {
        this.pinnedNews = data;
        this.cdr.detectChanges();
      },
      error: () => this.error = true,
    });
  }

  loadRegular(): void {
    this.loading = true;
    const skip = (this.currentPage - 1) * this.limit;

    this.newsService.getNews(this.limit, skip, false).subscribe({
      next: (data) => {
        this.regularNews = data;
        this.hasNextPage = data.length === this.limit;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadRegular();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const last = this.hasNextPage ? this.currentPage + 1 : this.currentPage;

    if (last <= 5) {
      for (let i = 1; i <= last; i++) pages.push(i);
    } else {
      pages.push(1);
      if (this.currentPage > 3) pages.push(-1);
      for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(last - 1, this.currentPage + 1); i++) {
        pages.push(i);
      }
      if (this.currentPage < last - 2) pages.push(-1);
      pages.push(last);
    }

    return pages;
  }
}
