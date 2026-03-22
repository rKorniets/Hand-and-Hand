import { Component, Input } from '@angular/core';
import { NewsItem } from '../news.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-pinned',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './news-pinned.html',
  styleUrls: ['./news-pinned.scss'],
})
export class NewsPinnedComponent {
  @Input() items: NewsItem[] = [];

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/330x190';
  }
}
