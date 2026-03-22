import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ItemFun } from '../fun.model';

@Component({
  selector: 'app-list-events',
  standalone: true,
  imports: [CommonModule, DatePipe],
  providers: [],
  templateUrl: './list-events.html',
  styleUrl: './list-events.scss',
})
export class ListEvents {
  @Input() itemsFun: ItemFun[] = [];

  isSameDay(item: ItemFun): boolean {
    if (!item.starts_at || !item.ends_at) return false;

    const start = new Date(item.starts_at);
    const end = new Date(item.ends_at);
    return start.toDateString() === end.toDateString();
  }
}
