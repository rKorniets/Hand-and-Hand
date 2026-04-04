import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationService, PaginatedOrganization } from './organization.service';

@Injectable({ providedIn: 'root' })
export class OrganizationResolver implements Resolve<PaginatedOrganization> {
  constructor(private organizationService: OrganizationService) {}

  resolve(): Observable<PaginatedOrganization> {
    return this.organizationService.getOrganization();
  }
}
