import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../tokens';
import { TicketItem, CreateTaskFromTicketDto, TicketTask } from './ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {}

  getTickets(
    limit = 20,
    skip = 0,
    search?: string,
    tab?: 'available' | 'my',
  ): Observable<TicketItem[]> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);
    if (search) params = params.set('search', search);
    if (tab) params = params.set('tab', tab);
    return this.http.get<TicketItem[]>(`${this.apiUrl}/tickets`, { params });
  }

  getTicketById(id: number): Observable<TicketItem> {
    return this.http.get<TicketItem>(`${this.apiUrl}/tickets/${id}`);
  }

  acceptTicketAsTask(dto: CreateTaskFromTicketDto): Observable<TicketTask> {
    return this.http.post<TicketTask>(`${this.apiUrl}/tasks`, dto);
  }
}
