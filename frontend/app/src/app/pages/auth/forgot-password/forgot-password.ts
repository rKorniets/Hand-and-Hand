import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPassword {
  email = '';
  error = '';
  successMessage = '';
  loading = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.email) return;
    this.loading = true;

    this.authService.resetPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Перевірте пошту';
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Помилка';
        this.loading = false;
      }
    });
  }
}
