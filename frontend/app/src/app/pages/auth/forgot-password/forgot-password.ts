import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
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
  isSuccess = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  onSubmit() {
    if (!this.email) return;
    this.loading = true;
    this.error = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.isSuccess = true;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.message || 'Сталася помилка при відправці. Спробуйте пізніше.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  retry() {
    this.isSuccess = false;
    this.error = '';
    this.cdr.detectChanges();
  }
}
