import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.scss'],
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  state: 'loading' | 'success' | 'error' = 'loading';
  errorMessage = '';

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const token = params['token'];
    const userId = +params['userId'];

    if (!token || !userId) {
      this.state = 'error';
      this.errorMessage = 'Невалідне посилання для підтвердження.';
      return;
    }

    this.authService.verifyEmail(userId, token).subscribe({
      next: () => {
        this.state = 'success';
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage = err?.error?.message || 'Щось пішло не так. Спробуйте ще раз.';
      },
    });
  }
}
