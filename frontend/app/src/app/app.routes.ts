import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutUs } from './pages/about-us/about-us';
import {PolicyAndRules} from './pages/policy-and-rules/policy-and-rules';
import { Events } from './pages/events/events';
import { NewsComponent } from './pages/news/news';
import { NewsResolver } from './pages/news/news.resolver';
import { EventsResolver } from './pages/events/events.resolver';
import { EventDetailComponent } from './pages/events/event-detail/event-detail';
import { FundraisingCampaigns } from './pages/fundraising-campaigns/fundraising-campaigns';
import { OrganizationsPage } from './pages/organizations/organizations';
import { OrganizationResolver} from './pages/organizations/organizations.resolver';
import { NewsDetailComponent } from './pages/news/news-detail/news-detail';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { ProfileUserComponent } from './pages/profile-user/profile-user';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: AboutUs },
  { path: 'policy-and-rules', component: PolicyAndRules },
  { path: 'events', component: Events, resolve: { data: EventsResolver }},
  { path: 'news', component: NewsComponent, resolve: { data: NewsResolver } },
  { path: 'news/:id', component: NewsDetailComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'fundraising', component: FundraisingCampaigns },
  { path: 'organizations', component: OrganizationsPage, resolve: { data: OrganizationResolver }},
  { path: 'events', component: Events },
  { path: 'news', component: NewsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile-user', component: ProfileUserComponent },
];
