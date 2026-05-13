import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { API_BASE_URL } from '../../../tokens';

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
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    @Inject(API_BASE_URL) private apiUrl: string,
  ) {
    this.reportForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      file: [null, Validators.required],
      project_id: [null],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
      this.reportForm.patchValue({ file });
      this.reportForm.get('file')?.updateValueAndValidity();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.reportForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.reportForm.invalid || !this.selectedFile) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      title: this.reportForm.value.title,
      type: this.reportForm.value.type,
      description: this.reportForm.value.description,
      project_id: this.reportForm.value.project_id,
      published_at: new Date().toISOString(),
    };

    this.http.post<{ id: number }>(`${this.apiUrl}/reports`, payload).subscribe({
      next: (createdReport) => {
        const formData = new FormData();
        formData.append('file', this.selectedFile!);

        this.http.post(`${this.apiUrl}/reports/${createdReport.id}/upload`, formData).subscribe({
          next: () => {
            this.isSubmitting = false;
            void this.router.navigate(['/profile-organization']);
          },
          error: (err) => {
            console.error('Upload error:', err);
            this.isSubmitting = false;
          },
        });
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
