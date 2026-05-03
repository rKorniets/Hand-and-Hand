import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsItem } from './news.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../tokens';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

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

    return this.http.get<NewsItem[]>(`${this.apiUrl}/news`, { params });
  }

  getNewsById(id: number): Observable<NewsItem> {
    const params = new HttpParams().set('t', Date.now().toString());
    return this.http.get<NewsItem>(`${this.apiUrl}/news/${id}`, { params });
  }

  createNews(newsData: {
    title: string;
    description: string;
    main_content: string;
  }): Observable<NewsItem> {
    return this.http.post<NewsItem>(`${this.apiUrl}/news`, newsData);
  }

  uploadNewsImage(newsId: number, file: File): Observable<{ image_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.patch<{ image_url: string }>(`${this.apiUrl}/news/${newsId}/image`, formData);
  }
}
