import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

export interface AdminProfile {
  id: number;
  email: string;
  role: string;
  status: string;
  city: string;
  first_name: string;
  last_name: string;
  created_at: string;
  admin_profile: null;
}

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-profile.html',
})
export class AdminProfileComponent implements OnInit {
  profile: AdminProfile | null = null;
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.authService
      .getMe()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data: any) => {
          this.profile = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Не вдалося завантажити профіль.';
          this.cdr.detectChanges();
        },
      });
  }

  logout() {
    this.authService.logout();
  }
}
