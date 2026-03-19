import { Component, Input } from '@angular/core';
import { NewsItem } from '../news.model';

@Component({
  selector: 'app-news-pinned',
  standalone: true,
  imports: [],
  templateUrl: './news-pinned.html',
  styleUrls: ['./news-pinned.scss'],
})
export class NewsPinnedComponent {
  @Input() items: NewsItem[] = [];
}
