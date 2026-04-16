import { Component, Input } from '@angular/core';
import { NewsItem } from '../news.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news-content',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './news-content.html',
  styleUrls: ['./news-content.scss'],
})
export class NewsContentComponent {
  private _items: NewsItem[] = [];

  @Input()
  set items(value: any) {
    if (Array.isArray(value)) {
      this._items = value;
    } else if (value && typeof value === 'object' && Array.isArray(value.data)) {
      this._items = value.data;
    } else {
      this._items = [];
    }
  }

  get items(): NewsItem[] {
    return this._items;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/330x190';
  }
}
