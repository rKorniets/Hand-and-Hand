import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsItem } from './news.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly apiUrl = 'http://localhost:3000/news';

  constructor(private http: HttpClient) {}

  getNews(
    limit = 10,
    skip = 0,
    isPinned?: boolean,
    search?: string,
    categories?: string[],
  ): Observable<NewsItem[]> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);

    if (isPinned !== undefined) {
      params = params.set('isPinned', String(isPinned));
    }
    if (search) {
      params = params.set('search', search);
    }
    if (categories?.length) {
      params = params.set('categories', categories.join(','));
    }

    return this.http.get<NewsItem[]>(this.apiUrl, { params });
  }

  getNewsById(id: number): Observable<NewsItem> {
    const params = new HttpParams().set('t', Date.now().toString());
    return this.http.get<NewsItem>(`${this.apiUrl}/${id}`, { params });
  }
}
