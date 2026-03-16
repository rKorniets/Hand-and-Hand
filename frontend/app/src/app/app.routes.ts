import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutUs } from './pages/about-us/about-us';
import {PolicyAndRules} from './pages/policy-and-rules/policy-and-rules';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: AboutUs },
  { path: 'policy-and-rules', component: PolicyAndRules },
];
