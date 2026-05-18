import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { user_role_enum } from '@prisma/client';

@Component({
  selector: 'app-header-content',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-content.html',
  styleUrl: './header-content.scss',
})
export class HeaderContent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  handleWantToHelp(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = isLoggedIn ? this.authService.getRole() : null;

    if (userRole === user_role_enum.ORGANIZATION) {
      this.router.navigate(['/tickets']);
    } else {
      this.router.navigate(['/fundraising']);
    }
  }

  handleNeedHelp(): void {
    const isLoggedIn = this.authService.isLoggedIn();

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
}
