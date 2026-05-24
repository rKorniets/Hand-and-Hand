import {
  Component,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import {
  Organization,
  AvailableUser,
  PendingMembershipRequest,
  MembershipStatus,
} from '../profile-organization.model';
import { OrganizationProfileService } from '../profile-organization.service';

@Component({
  selector: 'app-invite-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './invite-panel.html',
  styleUrl: './invite-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitePanel implements OnChanges, OnInit, OnDestroy {
  @Input() organization: Organization | null = null;
  @Input() isPanelOpen = false;
  @Output() panelClose = new EventEmitter<void>();

  users: AvailableUser[] = [];
  pendingRequests: PendingMembershipRequest[] = [];
  searchQuery = '';
  invitedIds = new Set<number>();
  resolvedRequestIds = new Map<number, 'accepted' | 'rejected'>();

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private orgService: OrganizationProfileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) =>
          this.organization?.id
            ? this.orgService.getAvailableUsers(this.organization.id, q)
            : of([]),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((users) => {
        this.users = users;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isPanelOpen']?.currentValue === true && this.organization?.id) {
      this.loadUsers('');
      this.loadRequests();
    }
    if (changes['isPanelOpen']?.currentValue === false) {
      this.searchQuery = '';
      this.invitedIds.clear();
      this.resolvedRequestIds.clear();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(q: string) {
    this.searchSubject.next(q);
  }

  invite(user: AvailableUser) {
    this.orgService.inviteUser(this.organization!.id, user.id).subscribe({
      next: () => {
        this.invitedIds.add(user.id);
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  acceptRequest(request: PendingMembershipRequest) {
    this.orgService.acceptMembershipRequest(this.organization!.id, request.id).subscribe({
      next: () => {
        this.resolvedRequestIds.set(request.id, 'accepted');
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  rejectRequest(request: PendingMembershipRequest) {
    this.orgService.rejectMembershipRequest(this.organization!.id, request.id).subscribe({
      next: () => {
        this.resolvedRequestIds.set(request.id, 'rejected');
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  getFullName(user: { first_name: string; last_name: string } | null): string {
    if (!user) return '—';
    return `${user.first_name} ${user.last_name}`;
  }

  getUserId(request: PendingMembershipRequest): number {
    return request.user?.id ?? request.user_id;
  }

  close() {
    this.panelClose.emit();
  }

  private loadUsers(search: string) {
    this.orgService
      .getAvailableUsers(this.organization!.id, search)
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        this.cdr.markForCheck();
      });
  }

  private loadRequests() {
    this.orgService
      .getMembershipRequests(this.organization!.id, MembershipStatus.PENDING)
      .pipe(takeUntil(this.destroy$))
      .subscribe((requests) => {
        this.pendingRequests = requests;
        this.cdr.markForCheck();
      });
  }
}
