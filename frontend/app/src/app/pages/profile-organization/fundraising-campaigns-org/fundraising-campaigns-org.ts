import { Component, Input, OnInit } from '@angular/core';
import { SlicePipe, CommonModule } from "@angular/common";
import { RouterLink } from '@angular/router';
import { Organization, FundraisingCampaign } from '../profile-organization.model';
import { OrganizationProfileService } from '../profile-organization.service';
import {UiHelperService} from '../../profile-user/toggleExpansion.service';

@Component({
  selector: 'app-fundraising-campaigns-org',
  standalone: true,
  imports: [SlicePipe, RouterLink, CommonModule],
  templateUrl: './fundraising-campaigns-org.html',
  styleUrl: './fundraising-campaigns-org.scss',
})
export class FundraisingCampaignsOrg implements OnInit {
  @Input() organization: Organization | null = null;

  fundraisingCampaignItem: FundraisingCampaign[] = [];
  isExpanded: boolean = false;

  constructor(
    private uiHelper: UiHelperService,
    private orgService: OrganizationProfileService
  ) {}

  ngOnInit(): void {
    if (this.organization) {
      this.orgService.getOrgFundraising(this.organization.id).subscribe((data: FundraisingCampaign[]) => {
        this.fundraisingCampaignItem = data;
      });
    }
  }

  getOrgFundraising(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
