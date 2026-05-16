import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FundraisingCampaignItem } from '../fundraising-campaings.model';
import { RouterModule } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { PaginationComponent } from '../../../components/pagination/pagination';

@Component({
  selector: 'app-list-fundraising-campaigns',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent],
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
