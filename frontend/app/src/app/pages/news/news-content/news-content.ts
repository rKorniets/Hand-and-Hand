import { Component, Input } from '@angular/core';
import { NewsItem } from '../news.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-content',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './news-content.html',
  styleUrls: ['./news-content.scss'],
})
export class NewsContentComponent {
  @Input() items: NewsItem[] = [];

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/330x190';
  }
}
