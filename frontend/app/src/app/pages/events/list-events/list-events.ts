import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NewEvent } from '../event.model';

@Component({
  selector: 'app-list-events',
  standalone: true,
  imports: [CommonModule, DatePipe],
  providers: [],
  templateUrl: './list-events.html',
  styleUrl: './list-events.scss',
})
export class ListEvents {
  @Input() events: NewEvent[] = [];
}
