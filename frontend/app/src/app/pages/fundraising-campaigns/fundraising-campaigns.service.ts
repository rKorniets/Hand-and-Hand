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

  // Додали limit та skip сюди:
  getCampaigns(
    limit: number = 4,
    skip: number = 0,
  ): Observable<{ data: FundraisingCampaignItem[]; total: number }> {
    const params = new HttpParams().set('limit', limit.toString()).set('skip', skip.toString());

    return this.http.get<{ data: FundraisingCampaignItem[]; total: number }>(this.apiUrl, {
      params,
    });
  }

  getCampaignById(id: number): Observable<FundraisingCampaignItem> {
    return this.http.get<FundraisingCampaignItem>(`${this.apiUrl}/${id}`);
  }
}
