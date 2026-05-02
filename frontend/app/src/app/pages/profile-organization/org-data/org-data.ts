import { Component, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Organization } from '../profile-organization.model';
import { OrganizationProfileService } from '../profile-organization.service';

@Component({
  selector: 'app-org-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './org-data.html',
  styleUrl: './org-data.scss',
})
export class OrgData implements OnChanges {
  @Input() organization: Organization | null = null;
  @Input() isOwner: boolean = false;

  description = '';
  editing = false;
  saving = false;

  constructor(
    private orgService: OrganizationProfileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(): void {
    this.description = this.organization?.description ?? '';
  }

  toggleEdit(): void {
    this.editing = true;
    this.cdr.detectChanges();
  }

  onSave(): void {
    if (!this.organization) return;

    this.saving = true;
    this.orgService
      .updateOrganization(this.organization.id, { description: this.description })
      .subscribe({
        next: () => {
          if (this.organization) {
            this.organization.description = this.description;
          }
          this.editing = false;
          this.saving = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.saving = false;
          this.cdr.detectChanges();
        },
      });
  }
}
