import { Component } from '@angular/core';
import {MainContent} from './main-content/main-content';
import {HeaderContent} from './header-content/header-content';
import {FooterContent} from './footer-content/footer-content';

@Component({
  selector: 'app-home',
  imports: [HeaderContent, FooterContent, MainContent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
}
