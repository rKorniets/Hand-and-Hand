import { Component, Input } from '@angular/core';
import { Organization } from '../organizations.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-org',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-org.html',
  styleUrls: ['./list-org.scss'],
})
export class ListOrgComponent {
  @Input() organizations: Organization[] = [];
}
