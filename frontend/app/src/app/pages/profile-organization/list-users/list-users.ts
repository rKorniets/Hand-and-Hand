import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Organization, OrgMember } from '../profile-organization.model';
import { OrganizationProfileService } from '../profile-organization.service';
import { UiHelperService } from '../../profile-user/toggleExpansion.service';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-users.html',
  styleUrl: './list-users.scss',
})
export class ListUsers implements OnChanges {
  @Input() organization: Organization | null = null;

  members: OrgMember[] = [];
  readonly collapseCount = 3;
  expanded = false;

  constructor(
    private uiHelper: UiHelperService,
    private orgService: OrganizationProfileService,
  ) {}

  ngOnChanges(): void {
    if (this.organization) {
      this.orgService.getOrgMembers(this.organization.id).subscribe((data) => {
        this.members = Array.isArray(data) ? data : [];
      });
    }
    this.expanded = false;
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
    this.members = this.members.filter((m) => m.id !== member.id);
    if (this.members.length <= this.collapseCount) {
      this.expanded = false;
    }
  }

  onAdd(): void {}
}
