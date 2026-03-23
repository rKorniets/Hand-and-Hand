import { Component } from '@angular/core';
import {Categories} from './categories/categories'
import {ListEvents} from './list-events/list-events'
import {Map} from './map/map';

@Component({
  selector: 'app-events',
  imports: [Categories, Map, ListEvents],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events {}
