import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FundraisingCampaignItem } from './fundraising-campaings.model';

@Injectable({
  providedIn: 'root',
})
export class FundraisingCampaignsService {
  private apiUrl = 'http://localhost:3000/fundraising_campaigns';
  private http = inject(HttpClient);

  getCampaigns(
    limit: number = 4,
    skip: number = 0,
    search?: string,
    categories?: string[],
    status?: string[],
  ): Observable<{ data: FundraisingCampaignItem[]; total: number }> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (categories?.length) {
      params = params.set('categories', categories.join(','));
    }
    if (status?.length) {
      params = params.set('status', status.join(','));
    }

    return this.http.get<{ data: FundraisingCampaignItem[]; total: number }>(this.apiUrl, {
      params,
    });
  }

  getCampaignById(id: number): Observable<FundraisingCampaignItem> {
    return this.http.get<FundraisingCampaignItem>(`${this.apiUrl}/${id}`);
  }
}
