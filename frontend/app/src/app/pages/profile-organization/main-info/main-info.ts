import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() locationChange = new EventEmitter<OrgLocation>();

  onEditProfile(): void {
    const newCity = prompt('Введіть нове місто:');
    const newAddress = prompt('Введіть нову адресу:');

    if (this.location) {
      const updated: OrgLocation = {
        ...this.location,
        city: newCity ?? this.location.city,
        address: newAddress ?? this.location.address,
      };
      this.locationChange.emit(updated);
    }
  }
}
