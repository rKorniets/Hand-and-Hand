import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewsService } from './news.service';
import { NewsItem } from './news.model';

@Injectable({ providedIn: 'root' })
export class NewsResolver
  implements Resolve<{ pinned: NewsItem[]; regular: NewsItem[]; totalRegular: number }>
{
  constructor(private newsService: NewsService) {}

  resolve(): Observable<{ pinned: NewsItem[]; regular: NewsItem[]; totalRegular: number }> {
    return forkJoin({
      pinned: this.newsService.getNews(10, 0, true),
      regular: this.newsService.getNews(5, 0, false),
    }).pipe(
      map(({ pinned, regular }) => ({
        pinned: pinned.data,
        regular: regular.data,
        totalRegular: regular.total,
      })),
    );
  }
}
