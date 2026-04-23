import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common'; // Додав Location
import { FundraisingCampaignsService } from '../fundraising-campaigns.service';
import { FundraisingCampaignItem } from '../fundraising-campaings.model';

@Component({
  selector: 'app-fundraising-campaigns-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fundraising-campaigns-detail.html',
  styleUrl: './fundraising-campaigns-detail.scss',
})
export class FundraisingCampaignsDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private fundraisingService = inject(FundraisingCampaignsService);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);

  campaign?: FundraisingCampaignItem;

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
    }
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
}
