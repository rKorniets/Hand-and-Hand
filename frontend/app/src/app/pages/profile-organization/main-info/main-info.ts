import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Organization, OrgLocation } from '../profile-organization.model';

@Component({
  selector: 'app-main-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-info.html',
  styleUrl: './main-info.scss',
})
export class MainInfo {
  @Input() organization: Organization | null = null;
  @Input() location: OrgLocation | null = null;
}
