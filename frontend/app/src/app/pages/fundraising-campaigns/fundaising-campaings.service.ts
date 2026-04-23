import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FundraisingCampaignItem } from './fundraising-campaings.model';

@Injectable({ providedIn: 'root' })
export class FundraisingService {
  private readonly apiUrl = 'http://localhost:3000/fundraising-campaigns';

  constructor(private http: HttpClient) {}

  getCampaigns(
    limit = 10,
    skip = 0,
    search?: string,
    categories?: string[],
    status?: string[],
  ): Observable<FundraisingCampaignItem[]> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);

    if (search) {
      params = params.set('search', search);
    }
    if (categories?.length) {
      params = params.set('categories', categories.join(','));
    }

    return this.http.get<FundraisingCampaignItem[]>(this.apiUrl, { params });
  }
}
