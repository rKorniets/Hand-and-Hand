import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports-constructors',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reports-constructors.html',
  styleUrl: './reports-constructors.scss',
})
export class ReportsConstructors {
  reportForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.reportForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      file_url: ['', [Validators.required, Validators.pattern('(https?://.*)')]],
      project_id: [null],
    });
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.reportForm.value,
      published_at: new Date().toISOString(),
    };

    this.http.post('http://localhost:3000/reports', payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/profile-organization']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        const errorMessage = err.error?.message || 'Сталася помилка при збереженні звіту.';
        alert(errorMessage);
      },
    });
  }
}
