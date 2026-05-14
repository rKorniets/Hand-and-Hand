import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FundraisingCampaignsService } from '../fundraising-campaigns.service';
import { FundraisingCampaignItem } from '../fundraising-campaings.model';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-fundraising-campaigns-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fundraising-campaigns-detail.html',
  styleUrl: './fundraising-campaigns-detail.scss',
})
export class FundraisingCampaignsDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private fundraisingService = inject(FundraisingCampaignsService);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  private socketService = inject(SocketService);

  campaign?: FundraisingCampaignItem;
  private subs: Subscription = new Subscription();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fundraisingService.getCampaignById(+id).subscribe({
        next: (data: FundraisingCampaignItem) => {
          this.campaign = data;
          this.cdr.detectChanges();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => console.error('Помилка завантаження:', err),
      });

      this.initSocketListeners();
    }
  }

  private initSocketListeners(): void {
    const donationSub = this.socketService
      .listen<{ campaignId: number; amount: number; newTotal: number }>('donationProcessed')
      .subscribe((data) => {
        if (this.campaign && this.campaign.id === data.campaignId) {
          this.campaign.current_amount = data.newTotal;
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
        if (this.campaign && this.campaign.id === data.campaignId) {
          this.campaign.current_amount = data.currentAmount;
          this.campaign.status = data.status;
          this.cdr.detectChanges();
        }
      });

    this.subs.add(donationSub);
    this.subs.add(monoSub);
  }

  calculateProgress(campaign: FundraisingCampaignItem): number {
    const goal = Number(campaign.goal_amount);
    const current = Number(campaign.current_amount);
    if (!goal || goal === 0) return 0;
    const percent = (current / goal) * 100;
    return percent > 100 ? 100 : percent;
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
