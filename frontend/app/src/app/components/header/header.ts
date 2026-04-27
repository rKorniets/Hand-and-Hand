import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../pages/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  isLoggedIn = false;
  private sub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.sub = this.authService.isLoggedIn$.subscribe((val) => {
      this.isLoggedIn = val;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goToProfile() {
    const role = this.authService.getRole();
    if (role === 'ADMIN') this.router.navigate(['/profile/admin']);
    else if (role === 'ORGANIZATION') this.router.navigate(['/profile-organization']);
    else this.router.navigate(['/profile-user']);
  }
}
