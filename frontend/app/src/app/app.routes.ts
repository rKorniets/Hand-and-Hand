import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutUs } from './pages/about-us/about-us';
import {PolicyAndRules} from './pages/policy-and-rules/policy-and-rules';
import { Events } from './pages/events/events';
import { NewsComponent } from './pages/news/news';
import { NewsResolver } from './pages/news/news.resolver';
import {EventsResolver} from './pages/events/events.resolver';
import { FundraisingCampaigns } from './pages/fundraising-campaigns/fundraising-campaigns';
import {Organizations} from './pages/organizations/organizations';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: AboutUs },
  { path: 'policy-and-rules', component: PolicyAndRules },
  { path: 'events', component: Events, resolve: { data: EventsResolver }},
  { path: 'news', component: NewsComponent, resolve: { data: NewsResolver } },
  { path: 'events', component: Events },
  { path: 'organizations', component: Organizations},
  { path: 'news', component: NewsComponent },
  { path: 'fundraising', component: FundraisingCampaigns },
];
