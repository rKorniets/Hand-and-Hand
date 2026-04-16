import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from './organizations.model';

export interface PaginatedOrganization {
  data: Organization[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly apiUrl = 'http://localhost:3000/organization-profiles';

  constructor(private http: HttpClient) {}

  getOrganization(limit = 20, skip = 0, status?: string): Observable<Organization[]> {
    let params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip);

    if (status !== undefined) {
      params = params.set('status', status);
    }

    return this.http.get<Organization[]>(this.apiUrl, { params });
  }

  getOrganizationById(id: number): Observable<Organization> {
    const params = new HttpParams().set('t', Date.now().toString());
    return this.http.get<Organization>(`${this.apiUrl}/${id}`, { params });
  }
}
