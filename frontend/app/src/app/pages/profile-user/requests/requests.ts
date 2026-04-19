import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppUser, ITicket } from '../profile-user.model';
import { UiHelperService } from '../toggleExpansion.service';
import { UserProfileService } from '../profile-user.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class Requests implements OnInit {
  @Input() user: AppUser | undefined;

  requests: ITicket[] = [];
  isExpanded: boolean = false;

  constructor(
    private uiHelper: UiHelperService,
    private profileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.getUserRequests().subscribe({
      next: (data) => (this.requests = data),
      error: (err) => console.error(err),
    });
  }

  isClosed(status: string | undefined): boolean {
    if (!status) return false;
    return ['CLOSED', 'RESOLVED', 'CANCELLED'].includes(status);
  }

  toggleRequests(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }
}
