import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NewsService } from '../../news/news.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-news-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './news-create.html',
  styleUrls: ['./news-create.scss'],
})
export class NewsCreateComponent implements OnInit {
  newsForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(5000)]],
      main_content: ['', [Validators.required, Validators.maxLength(10000)]],
      image: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (this.authService.getRole() !== 'ORGANIZATION') {
      this.router.navigate(['/news']);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
      this.newsForm.patchValue({ image: file });
      this.newsForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.newsForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.newsForm.invalid || !this.selectedFile) {
      this.newsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const newsData = {
      title: this.newsForm.value.title,
      description: this.newsForm.value.description,
      main_content: this.newsForm.value.main_content,
    };

    this.newsService.createNews(newsData).subscribe({
      next: (createdNews) => {
        this.newsService.uploadNewsImage(createdNews.id, this.selectedFile!).subscribe({
          next: () => this.router.navigate(['/news', createdNews.id]),
          error: (err) => {
            console.error('Upload error:', err);
            this.isSubmitting = false;
          },
        });
      },
      error: (err) => {
        console.error('Create error:', err);
        this.isSubmitting = false;
      },
    });
  }
}
