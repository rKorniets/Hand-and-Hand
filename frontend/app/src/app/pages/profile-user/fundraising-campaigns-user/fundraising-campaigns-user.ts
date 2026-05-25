import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
export class FundraisingCampaignsUser implements OnInit, OnChanges {
  @Input() user: AppUser | undefined;
  @Input() fundraisingCampaignItem: FundraisingCampaign[] = [];
  @Input() isOwnProfile: boolean = false;

  isExpanded: boolean = false;

  constructor(
    private uiHelper: UiHelperService,
    private profileService: UserProfileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadFundraisingCampaigns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && !changes['user'].firstChange) {
      this.loadFundraisingCampaigns();
    }
  }

  private loadFundraisingCampaigns(): void {
    if (this.user?.id) {
      this.profileService.getUserFundraisingCampaigns(this.user.id).subscribe({
        next: (res) => {
          this.fundraisingCampaignItem = Array.isArray(res.data) ? res.data : [];
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.fundraisingCampaignItem = [];
          this.cdr.markForCheck();
        },
      });
    }
  }

  toggleFundraisingCampaigns(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
