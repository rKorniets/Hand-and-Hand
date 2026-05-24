import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Organization, OrgMember } from '../profile-organization.model';
import { OrganizationProfileService } from '../profile-organization.service';
import { UiHelperService } from '../../profile-user/toggleExpansion.service';
import { InvitePanel } from '../invite-panel/invite-panel';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, InvitePanel],
  templateUrl: './list-users.html',
  styleUrl: './list-users.scss',
})
export class ListUsers implements OnChanges {
  @Input() organization: Organization | null = null;

  members: OrgMember[] = [];
  readonly collapseCount = 3;
  expanded = false;
  showInvitePanel = false;

  constructor(
    private uiHelper: UiHelperService,
    private orgService: OrganizationProfileService,
  ) {}

  ngOnChanges(): void {
    if (this.organization?.id) {
      this.orgService.getOrgMembers(Number(this.organization.id)).subscribe((data: unknown) => {
        if (Array.isArray(data)) {
          this.members = data as OrgMember[];
        } else if (this.isOrgMembersResponse(data)) {
          this.members = data.members;
        } else {
          this.members = [];
        }
      });
    }
    this.expanded = false;
  }

  private isOrgMembersResponse(data: unknown): data is { members: OrgMember[] } {
    return (
      typeof data === 'object' &&
      data !== null &&
      'members' in data &&
      Array.isArray((data as { members: unknown }).members)
    );
  }

  get visibleMembers(): OrgMember[] {
    return this.expanded ? this.members : this.members.slice(0, this.collapseCount);
  }

  getFullName(member: OrgMember): string {
    return `${member.first_name} ${member.last_name}`;
  }

  toggleExpand(element?: HTMLElement): void {
    this.expanded = this.uiHelper.toggleExpansion(this.expanded, element);
  }

  onDelete(member: OrgMember): void {
    this.orgService.removeMember(Number(this.organization!.id), member.id).subscribe({
      next: () => {
        this.members = this.members.filter((m) => m.id !== member.id);
        if (this.members.length <= this.collapseCount) {
          this.expanded = false;
        }
      },
      error: (err) => {
        console.error('Failed to remove member', err);
      },
    });
  }

  onAdd(): void {
    if (!this.organization?.id) return;
    this.showInvitePanel = true;
  }
}
