import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Organization } from '../profile-organization.model';

@Component({
  selector: 'app-org-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './org-data.html',
  styleUrl: './org-data.scss',
})
export class OrgData implements OnChanges {
  @Input() organization: Organization | null = null;

  description = '';
  editing = false;

  ngOnChanges(): void {
    this.description = this.organization?.description ?? '';
  }

  toggleEdit(): void {
    this.editing = !this.editing;
  }

  onSave(): void {
    this.editing = false;
  }
}
