import { Component } from '@angular/core';
import {CategoriesOrg} from "./categories-org/categories-org";
import {ListOrg} from './list-org/list-org';

@Component({
  selector: 'app-organizations',
  imports: [ CategoriesOrg, ListOrg ],
  templateUrl: './organizations.html',
  styleUrl: './organizations.scss',
})
export class Organizations {}
