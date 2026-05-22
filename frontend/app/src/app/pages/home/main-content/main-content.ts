import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { user_role_enum } from '@prisma/client';

@Component({
  selector: 'app-main-content',
  imports: [],
  templateUrl: './main-content.html',
  styleUrl: './main-content.scss',
})
export class MainContent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  handleOrganization(): void {
    this.router.navigate(['/login']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  handlVolunteer(): void {
    this.router.navigate(['/login']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  handleNeedHelp(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    const userRole = this.authService.getRole();

    if (userRole === user_role_enum.ORGANIZATION) {
      this.router.navigate(['/activity/create']);
    } else {
      this.router.navigate(['/request']);
    }
  }
  handlEvents(): void {
    this.router.navigate(['/events']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  handlListOrg(): void {
    this.router.navigate(['/organizations']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  handlFundraising(): void {
    this.router.navigate(['/fundraising']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  handlNews(): void {
    this.router.navigate(['/news']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  handlAboutUs(): void {
    this.router.navigate(['/about']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
