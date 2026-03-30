import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { NewsService } from '../news.service';
import { NewsItem } from '../news.model';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-detail.html',
  styleUrls: ['./news-detail.scss'],
})
export class NewsDetailComponent implements OnInit {
  news: NewsItem | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.newsService.getNewsById(id).subscribe({
      next: (data) => {
        this.news = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
