import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsItem } from './news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly apiUrl = 'http://localhost:3000/news';

  constructor(private http: HttpClient) {}

  getNews(limit = 10, skip = 0, isPinned?: boolean): Observable<NewsItem[]> {
    let params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip);

    if (isPinned !== undefined) {
      params = params.set('isPinned', String(isPinned));
    }

    return this.http.get<NewsItem[]>(this.apiUrl, { params });
  }
}
