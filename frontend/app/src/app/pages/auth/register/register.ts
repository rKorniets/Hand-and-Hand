import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  activeTab: 'user' | 'org' = 'user';

  firstName = '';
  lastName = '';
  city = '';
  userEmail = '';
  userPassword = '';

  orgName = '';
  orgEdrpou = '';
  orgEmail = '';
  orgPassword = '';

  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  setTab(tab: 'user' | 'org') {
    this.activeTab = tab;
    this.error = '';
  }

  onSubmit() {
    this.error = '';
    this.loading = true;

    const request$ = this.activeTab === 'user'
      ? this.authService.registerUser({
        firstName: this.firstName,
        lastName: this.lastName,
        city: this.city,
        email: this.userEmail,
        password: this.userPassword,
      })
      : this.authService.registerOrganization({
        name: this.orgName,
        edrpou: this.orgEdrpou,
        email: this.orgEmail,
        password: this.orgPassword,
      });

    request$.subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = err.error?.message || 'Помилка реєстрації';
        this.loading = false;
      }
    });
  }
}
