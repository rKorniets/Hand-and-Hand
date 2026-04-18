import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesOrg } from "./categories-org/categories-org";
import { ListOrgComponent } from './list-org/list-org';
import { Organization } from './organizations.model';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [ CategoriesOrg, ListOrgComponent ],
  templateUrl: './organizations.html',
  styleUrl: './organizations.scss',
})
export class OrganizationsPage implements OnInit {
  organizations: Organization[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((res) => {
      if (res['data'] && res['data'].data) {
        this.organizations = res['data'].data;
      } else {
        this.organizations = res['data'];
      }
    });
  }
}
