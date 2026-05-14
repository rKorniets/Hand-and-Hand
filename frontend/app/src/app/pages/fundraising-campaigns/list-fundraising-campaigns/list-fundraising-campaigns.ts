import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FundraisingCampaignItem } from '../fundraising-campaings.model';
import { RouterModule } from '@angular/router';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-list-fundraising-campaigns',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-fundraising-campaigns.html',
  styleUrl: './list-fundraising-campaigns.scss',
})
export class ListFundraisingCampaigns implements OnInit, OnDestroy {
  @Input() fundraisingCampaignItem: FundraisingCampaignItem[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Output() pageChanged = new EventEmitter<number>();

  private socketService = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);
  private subs: Subscription = new Subscription();

  ngOnInit(): void {
    this.initSocketListeners();
  }

  private initSocketListeners(): void {
    const createSub = this.socketService
      .listen<FundraisingCampaignItem>('campaignCreated')
      .subscribe((newCampaign) => {
        if (this.currentPage === 1) {
          this.fundraisingCampaignItem = [newCampaign, ...this.fundraisingCampaignItem];
          this.cdr.detectChanges();
        }
      });

    const donationSub = this.socketService
      .listen<{ campaignId: number; amount: number; newTotal: number }>('donationProcessed')
      .subscribe((data) => {
        const campaign = this.fundraisingCampaignItem.find((c) => c.id === data.campaignId);
        if (campaign) {
          campaign.current_amount = data.newTotal;
          this.cdr.detectChanges();
        }
      });

    const monoSub = this.socketService
      .listen<{
        campaignId: number;
        currentAmount: number;
        status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
      }>('balanceUpdated')
      .subscribe((data) => {
        const campaign = this.fundraisingCampaignItem.find((c) => c.id === data.campaignId);
        if (campaign) {
          campaign.current_amount = data.currentAmount;
          campaign.status = data.status;
          this.cdr.detectChanges();
        }
      });

    this.subs.add(createSub);
    this.subs.add(donationSub);
    this.subs.add(monoSub);
  }

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.pageChanged.emit(page);
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
