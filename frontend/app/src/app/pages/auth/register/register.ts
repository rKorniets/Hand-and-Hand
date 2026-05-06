import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  activeTab: 'user' | 'org' = 'user';

  userForm: FormGroup;
  orgForm: FormGroup;

  error = '';
  loading = false;
  success = false;
  successEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      city: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.orgForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      edrpou: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get activeForm(): FormGroup {
    return this.activeTab === 'user' ? this.userForm : this.orgForm;
  }

  setTab(tab: 'user' | 'org') {
    this.activeTab = tab;
    this.error = '';
    this.success = false;
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
    if (errors['maxlength']) {
      const max = errors['maxlength'].requiredLength;
      return `Максимальна довжина — ${max} символів`;
    }
    if (errors['pattern']) {
      if (field === 'edrpou') return 'ЄДРПОУ має містити рівно 8 цифр';
      return 'Невірний формат';
    }

    return null;
  }

  onSubmit() {
    const form = this.activeForm;
    form.markAllAsTouched();

    if (form.invalid) return;

    this.error = '';
    this.loading = true;

    const request$ =
      this.activeTab === 'user'
        ? this.authService.registerUser(this.userForm.value)
        : this.authService.registerOrganization(this.orgForm.value);

    request$.subscribe({
      next: () => {
        this.loading = false;
        if (this.activeTab === 'org') {
          this.router.navigate(['/login'], {
            queryParams: { pending: 'org' },
          });
        } else {
          this.success = true;
          this.successEmail = this.userForm.value.email;
        }
      },
      error: (err) => {
        this.loading = false;
        const status = err?.status;

        if (status === 409) {
          this.error = 'Акаунт з такою поштою вже існує';
        } else if (status === 0) {
          this.error = 'Немає зʼєднання з сервером. Спробуйте пізніше';
        } else {
          this.error = err.error?.message || 'Помилка реєстрації. Спробуйте ще раз';
        }
      },
    });
  }
}
