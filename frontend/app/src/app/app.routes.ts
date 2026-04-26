import { Routes } from '@angular/router';
import { authGuard } from './pages/auth/auth.guard';
import { Home } from './pages/home/home';
import { AboutUs } from './pages/about-us/about-us';
import { PolicyAndRules } from './pages/policy-and-rules/policy-and-rules';
import { Events } from './pages/events/events';
import { NewsComponent } from './pages/news/news';
import { NewsResolver } from './pages/news/news.resolver';
import { EventsResolver } from './pages/events/events.resolver';
import { EventDetailComponent } from './pages/events/event-detail/event-detail';
import { FundraisingCampaigns } from './pages/fundraising-campaigns/fundraising-campaigns';
import { OrganizationsPage } from './pages/organizations/organizations';
import { OrganizationResolver } from './pages/organizations/organizations.resolver';
import { NewsDetailComponent } from './pages/news/news-detail/news-detail';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { AdminProfileComponent } from './pages/admin/admin-profile/admin-profile';
import { AdminPanelComponent } from './pages/admin/admin-panel/admin-panel';
import { ProfileOrganization } from './pages/profile-organization/profile-organization';
import { ProfileUserComponent } from './pages/profile-user/profile-user';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { EventsConstructorComponent } from './pages/constructors/events-constructor/events-constructor';
import { VolVerification } from './pages/auth/vol-verification/vol-verification';
import { ApplicationSubmitted } from './pages/auth/application-submitted/application-submitted';
import { FundraisingCampaignsDetail } from './pages/fundraising-campaigns/fundraising-campaigns-detail/fundraising-campaigns-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: AboutUs },
  { path: 'policy-and-rules', component: PolicyAndRules },
  { path: 'events', component: Events, resolve: { data: EventsResolver } },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'news', component: NewsComponent, resolve: { data: NewsResolver } },
  { path: 'news/:id', component: NewsDetailComponent },
  { path: 'fundraising', component: FundraisingCampaigns },
  { path: 'organizations', component: OrganizationsPage, resolve: { data: OrganizationResolver } },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'vol-verification', component: VolVerification },
  { path: 'application-submitted', component: ApplicationSubmitted },
  { path: 'profile/admin', component: AdminProfileComponent, canActivate: [authGuard] },
  {
    path: 'profile/admin/pending-organizations',
    component: AdminPanelComponent,
    canActivate: [authGuard],
  },
  { path: 'profile-organization', component: ProfileOrganization, canActivate: [authGuard] },
  { path: 'profile-user', component: ProfileUserComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'activity/create', component: EventsConstructorComponent, canActivate: [authGuard] },
  { path: 'activity/edit/:id', component: EventsConstructorComponent, canActivate: [authGuard] },
  { path: 'organizations/:id', component: ProfileOrganization },
  {
    path: 'fundraisingCampaign/create',
    loadComponent: () =>
      import('./pages/constructors/create-fundraising/create-fundraising').then(
        (m) => m.CreateFundraisingComponent,
      ),
  },
  { path: 'fundraising/:id', component: FundraisingCampaignsDetail },
];
