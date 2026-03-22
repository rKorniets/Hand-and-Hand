import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from './location.model';
@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly apiUrl = 'http://localhost:3000/location';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }
}
