import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationService } from './organization.service';
import { Organization } from './organizations.model';

@Injectable({ providedIn: 'root' })
export class OrganizationResolver implements Resolve<{ data: Organization[]; total: number }> {
  constructor(private organizationService: OrganizationService) {}

  resolve(): Observable<{ data: Organization[]; total: number }> {
    return this.organizationService.getOrganizations();
  }
}
