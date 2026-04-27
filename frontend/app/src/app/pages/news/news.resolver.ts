import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { NewsService } from './news.service';
import { NewsItem } from './news.model';

@Injectable({ providedIn: 'root' })
export class NewsResolver implements Resolve<{ pinned: NewsItem[]; regular: NewsItem[] }> {
  constructor(private newsService: NewsService) {}

  resolve(): Observable<{ pinned: NewsItem[]; regular: NewsItem[] }> {
    return forkJoin({
      pinned: this.newsService.getNews(10, 0, true),
      regular: this.newsService.getNews(10, 0, false),
    });
  }
}
