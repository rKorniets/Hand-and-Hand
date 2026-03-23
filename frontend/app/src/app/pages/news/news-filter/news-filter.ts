import { Component } from '@angular/core';

@Component({
  selector: 'app-news-filter',
  standalone: true,
  imports: [],
  templateUrl: './news-filter.html',
  styleUrls: ['./news-filter.scss'],
})
export class NewsFilterComponent {
  categories: string[] = [
    'Звіти',
    'Анонси',
    'Гайди та поради',
    'Робота всередини',
    'Благодійність',
    'Життя громади',
  ];
}
