import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsItem } from '../news.model';

@Component({
  selector: 'app-news-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-content.html',
  styleUrls: ['./news-content.scss'],
})
export class NewsContentComponent {
  @Input() items: NewsItem[] = [];
}
