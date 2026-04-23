import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundraisingCampaignItem } from '../fundraising-campaings.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-fundraising-campaigns',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-fundraising-campaigns.html',
  styleUrl: './list-fundraising-campaigns.scss',
})
export class ListFundraisingCampaigns {
  @Input() fundraisingCampaignItem: FundraisingCampaignItem[] = [];
  @Input() totalPages: number = 1;
  @Output() pageChanged = new EventEmitter<number>();

  currentPage: number = 1;

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPagesArray(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];

    return [1, '...', current - 1, current, current + 1, '...', total];
  }
}
