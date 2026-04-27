import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPassword implements OnInit {
  password = '';
  token = '';
  userId = '';
  error = '';
  successMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.userId = this.route.snapshot.queryParamMap.get('id') || '';

    if (!this.token || !this.userId) {
      this.error = 'Перейдіть за посиланням з листа ще раз.';
    }
  }

  onSubmit() {
    if (!this.password || !this.token || !this.userId) return;

    this.error = '';
    this.successMessage = '';
    this.loading = true;

    this.authService.resetPassword(this.userId, this.token, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Пароль успішно оновлено!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Не вдалося змінити пароль. Спробуйте ще раз.';
      },
    });
  }
  get buttonText(): string {
    if (this.loading) {
      return 'Завантаження...';
    }
    if (this.successMessage) {
      return 'Увійти...';
    }
    if (this.error) {
      return 'Спробуйте ще раз';
    }
    return 'Оновити пароль';
  }
}
