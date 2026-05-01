import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FundraisingCampaignItem } from './fundraising-campaings.model';
import { API_BASE_URL } from '../../tokens';

@Injectable({
  providedIn: 'root',
})
export class FundraisingCampaignsService {
  private apiUrl = `${inject(API_BASE_URL)}/fundraising_campaigns`;
  private http = inject(HttpClient);

  getCampaigns(
    limit: number = 4,
    skip: number = 0,
    search?: string,
    categories?: string[],
    status?: string[],
  ): Observable<{ data: FundraisingCampaignItem[]; total: number }> {
    let params = new HttpParams().set('limit', limit.toString()).set('skip', skip.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (categories?.length) {
      for (const c of categories) {
        params = params.append('categories', c);
      }
    }
    if (status?.length) {
      for (const s of status) {
        params = params.append('status', s);
      }
    }

    return this.http.get<{ data: FundraisingCampaignItem[]; total: number }>(this.apiUrl, {
      params,
    });
  }

  getCampaignById(id: number): Observable<FundraisingCampaignItem> {
    return this.http.get<FundraisingCampaignItem>(`${this.apiUrl}/${id}`);
  }
}
