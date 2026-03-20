import { Component } from '@angular/core';

import { NewsContentComponent } from './news-content/news-content';
import { NewsFilterComponent } from './news-filter/news-filter';
import { NewsPinnedComponent } from './news-pinned/news-pinned';
import { NewsItem } from './news.model';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    NewsPinnedComponent,
    NewsContentComponent,
    NewsFilterComponent],
  templateUrl: './news.html',
  styleUrls: ['./news.scss'],
})
export class NewsComponent {
  pinnedNews: NewsItem[] = [
    {
      id: 1,
      title: 'Тут відображається title прикріпленої новини',
      imageUrl: 'https://placehold.co/300x200',
      created_at: '01.01.2026(дата створення)',
      isPinned: true,
      description: '',
      mainContent: '',
      created_by:'',
    },
    {
      id: 2,
      title: 'Тут відображається title прикріпленої новини',
      imageUrl: 'https://placehold.co/300x200',
      created_at: '',
      isPinned: true,
      description: '',
      mainContent: '',
      created_by:'',
    },
    {
      id: 3,
      title: 'Тут відображається title прикріпленої новини',
      imageUrl: 'https://placehold.co/300x200',
      created_at: '01.01.2026',
      isPinned: true,
      description: 'можливо варто тут лишати якийсь опис новини крім тайтлу?',
      mainContent: '',
      created_by:'',
    },
    {
      id: 4,
      title: 'Тут відображається title прикріпленої новини',
      imageUrl: 'https://placehold.co/300x200',
      created_at: '01.01.2026',
      isPinned: true,
      description: 'можливо варто тут лишати якийсь опис новини крім тайтлу?',
      mainContent: '',
      created_by:'',
    },
  ];

  regularNews: NewsItem[] = [
    {
      id: 5,
      title: 'Тут title новини',
      imageUrl: 'https://placehold.co/300x200',
      created_at: '01.01.2026(дата новини)',
      isPinned: false,
      description: 'Тут відображається дескріпшн новини, а мейн контент буде відображатися після відкриття новини',
      mainContent: '',
      created_by:'',
    },
    {
      id: 6,
      title: 'Тут title новини',
      imageUrl: 'https://placehold.co/300x200',
      created_at: '01.01.2026(дата новини)',
      isPinned: false,
      description: 'Тут відображається дескріпшн новини, а мейн контент буде відображатися після відкриття новини',
      mainContent: '',
      created_by:'',
    },
    {
      id: 7,
      title: 'Тут title новини',
      imageUrl: 'https://placehold.co/300x200',
      created_at: '01.01.2026(дата новини)',
      isPinned: false,
      description: 'Тут відображається дескріпшн новини, а мейн контент буде відображатися після відкриття новини',
      mainContent: '',
      created_by:'',
    },
    {
      id: 8,
      title: 'Тут title новини',
      imageUrl: 'https://placehold.co/300x200',
      created_at: '01.01.2026(дата новини)',
      isPinned: false,
      description: 'Тут відображається дескріпшн новини, а мейн контент буде відображатися після відкриття новини',
      mainContent: '',
      created_by:'',
    },
  ];
}
