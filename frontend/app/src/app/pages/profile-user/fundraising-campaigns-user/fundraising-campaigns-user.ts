import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppUser, FundraisingCampaign } from '../profile-user.model';
import { UiHelperService } from '../toggleExpansion.service';
import { UserProfileService } from '../profile-user.service';

@Component({
  selector: 'app-fundraising-campaigns-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fundraising-campaigns-user.html',
  styleUrl: './fundraising-campaigns-user.scss',
})
export class FundraisingCampaignsUser implements OnInit {
  @Input() user: AppUser | undefined;
  @Input() fundraisingCampaignItem: FundraisingCampaign[] = [];

  isExpanded: boolean = false;

  constructor(
    private uiHelper: UiHelperService,
    private profileService: UserProfileService,
  ) {}

  ngOnInit(): void {
    if (this.fundraisingCampaignItem.length === 0) {
      this.profileService.getFundraisingCampaigns().subscribe({
        next: (res) => (this.fundraisingCampaignItem = res.data),
        error: (err) => console.error(err),
      });
    }
  }

  toggleFundraisingCampaigns(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
