import { Component } from '@angular/core';
import {MainHeaderContent} from './main-header-content/main-header-content';
import {MainFooterContent} from './main-footer-content/main-footer-content';
import {MainContent} from './main-content/main-content';

@Component({
  selector: 'app-home',
  imports: [MainHeaderContent, MainFooterContent, MainContent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
}
