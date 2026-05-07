import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Project, CreateProjectPayload, Category } from './events-constructor.model';
import { API_BASE_URL } from '../../../tokens';

@Injectable({ providedIn: 'root' })
export class EventsConstructorService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private async geocode(
    city: string,
    address: string,
    region: string,
  ): Promise<{ lat: number | null; lng: number | null }> {
    const query = [address, city, region].filter(Boolean).join(', ');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { 'User-Agent': 'HandAndHand/1.0' } },
      );
      const results: { lat: string; lon: string }[] = await res.json();
      if (results?.[0]) {
        return {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        };
      }
    } catch (err) {
      console.warn('[geocode] Failed to resolve coordinates for:', query, err);
    }
    return { lat: null, lng: null };
  }

  private async enrichWithCoords(payload: CreateProjectPayload): Promise<CreateProjectPayload> {
    if (!payload.location) return payload;

    const { city, address, region } = payload.location;
    const coords = await this.geocode(city, address, region);

    return {
      ...payload,
      location: {
        ...payload.location,
        ...coords,
      },
    };
  }

  createProject(payload: CreateProjectPayload): Observable<Project> {
    return from(this.enrichWithCoords(payload)).pipe(
      switchMap((enriched) =>
        this.http.post<Project>(`${this.apiUrl}/projects`, enriched, {
          headers: this.getHeaders(),
        }),
      ),
    );
  }

  updateProject(id: number, payload: CreateProjectPayload): Observable<Project> {
    return from(this.enrichWithCoords(payload)).pipe(
      switchMap((enriched) =>
        this.http.put<Project>(`${this.apiUrl}/projects/${id}`, enriched, {
          headers: this.getHeaders(),
        }),
      ),
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, {
      headers: this.getHeaders(),
    });
  }
}
