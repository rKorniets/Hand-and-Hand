import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  activeTab: 'user' | 'org' = 'user';

  userEmail = '';
  userPassword = '';

  orgEdrpou = '';
  orgPassword = '';

  error = '';
  loading = false;

  constructor(private authService: AuthService) {}

  setTab(tab: 'user' | 'org') {
    this.activeTab = tab;
    this.error = '';
  }

  onSubmit() {
    this.error = '';
    this.loading = true;

    const request$ = this.activeTab === 'user'
      ? this.authService.loginUser({
        email: this.userEmail,
        password: this.userPassword
      })
      : this.authService.loginOrganization({
        edrpou: this.orgEdrpou,
        password: this.orgPassword
      });

    request$.subscribe({
      error: (err) => {
        this.error = err.error?.message || 'Помилка входу';
        this.loading = false;
      }
    });
  }
}
