import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from './organizations.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly apiUrl = 'http://localhost:3000/organization-profiles';

  constructor(private http: HttpClient) {}

  getOrganizations(
    limit = 10,
    skip = 0,
    search?: string,
    categories?: string[],
  ): Observable<{ data: Organization[]; total: number }> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);

    if (search) params = params.set('search', search);
    if (categories?.length) params = params.set('categories', categories.join(','));

    return this.http.get<{ data: Organization[]; total: number }>(this.apiUrl, { params });
  }
  getOrganizationById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }
}
