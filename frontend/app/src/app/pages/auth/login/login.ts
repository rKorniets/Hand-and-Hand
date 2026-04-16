import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  activeTab: 'user' | 'org' = 'user';

  userForm: FormGroup;
  orgForm: FormGroup;

  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.orgForm = this.fb.group({
      edrpou: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get activeForm(): FormGroup {
    return this.activeTab === 'user' ? this.userForm : this.orgForm;
  }

  setTab(tab: 'user' | 'org') {
    this.activeTab = tab;
    this.error = '';
  }

  getError(form: FormGroup, field: string): string | null {
    const control: AbstractControl | null = form.get(field);
    if (!control || !control.invalid || !control.touched) return null;

    const errors = control.errors!;

    if (errors['required']) return 'Це поле є обовʼязковим';
    if (errors['email']) return 'Введіть коректну електронну адресу';
    if (errors['minlength']) {
      const min = errors['minlength'].requiredLength;
      return `Мінімальна довжина — ${min} символів`;
    }
    if (errors['pattern']) {
      if (field === 'edrpou') return 'ЄДРПОУ має містити рівно 8 цифр';
      return 'Невірний формат';
    }

    return null;
  }

  private getServerError(err: any): string {
    const status = err?.status;

    if (status === 401) return 'Невірний логін або пароль';
    if (status === 404) return 'Акаунт з такими даними не знайдено';
    if (status === 429) return 'Забагато спроб. Спробуйте пізніше';
    if (status === 0 || status === 503) return 'Немає зʼєднання з сервером. Спробуйте пізніше';

    const body = err?.error;
    if (typeof body === 'string' && body.length < 200) return body;
    if (typeof body?.message === 'string') return body.message;

    return 'Помилка входу. Спробуйте ще раз';
  }

  onSubmit() {
    const form = this.activeForm;
    form.markAllAsTouched();

    if (form.invalid) return;

    this.error = '';
    this.loading = true;

    const request$ =
      this.activeTab === 'user'
        ? this.authService.loginUser(this.userForm.value)
        : this.authService.loginOrganization(this.orgForm.value);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = this.getServerError(err);

        const passwordControl = form.get('password');

        if (passwordControl) {
          passwordControl.setValue('');
          passwordControl.markAsUntouched();
          passwordControl.markAsPristine();
        }
      },
    });
  }
}
