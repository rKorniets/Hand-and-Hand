import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUser, ITicket, TicketStatus } from '../profile-user.model';
import { RouterModule } from '@angular/router';
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
      next: (data) => this.requests = data,
      error: (err) => console.error(err),
    });
  }

  toggleRequests(target: HTMLElement): void {
    this.isExpanded = this.uiHelper.toggleExpansion(this.isExpanded, target);
  }

  isClosed(status: string): boolean {
    return status === TicketStatus.CLOSED;
  }
}
