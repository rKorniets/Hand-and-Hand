import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Хардкод-словник дефолтних картинок(Переробити під Cloudinary)
const DEFAULT_IMAGES: Record<string, string> = {
  military:
    'https://images.unsplash.com/photo-1595011706692-0b1a13fc6b1f?auto=format&fit=crop&w=800&q=80',
  medical:
    'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80',
  rebuild:
    'https://images.unsplash.com/photo-1541888081696-6d63044a1bfa?auto=format&fit=crop&w=800&q=80',
  default:
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80',
};

@Component({
  selector: 'app-create-fundraising',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-fundraising.html',
  styleUrl: './create-fundraising.scss',
})
export class CreateFundraisingComponent {
  campaignForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.campaignForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      main_content: ['', Validators.required],
      jar_link: ['', [Validators.required]],
      goal_amount: [null, [Validators.required, Validators.min(1)]],
      mono_token: ['', Validators.required],
      end_at: [''],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const category = this.campaignForm.value.category;
    const fallbackImageUrl = DEFAULT_IMAGES[category] || DEFAULT_IMAGES['default'];

    this.submitCampaignData(fallbackImageUrl);
  }

  private submitCampaignData(imageUrl: string) {
    const payload = {
      title: this.campaignForm.value.title,
      description: this.campaignForm.value.description,
      main_content: this.campaignForm.value.main_content,
      jar_link: this.campaignForm.value.jar_link,
      image_url: imageUrl,
      goal_amount: Number(this.campaignForm.value.goal_amount),
      mono_token: this.campaignForm.value.mono_token,
      end_at: this.campaignForm.value.end_at
        ? new Date(this.campaignForm.value.end_at).toISOString()
        : null,
    };

    this.http.post('http://localhost:3000/fundraising_campaigns', payload).subscribe({
      next: () => {
        this.isSubmitting = false;

        alert(
          'Дякуємо! Збір успішно створено та відправлено на розгляд адміністрації. Він з’явиться на сайті після підтвердження.',
        );

        this.router.navigate(['/profile-organization']);
      },
      error: (err) => {
        console.error('Помилка створення збору:', err);
        alert('Сталася помилка при збереженні збору. Спробуйте ще раз або зверніться в підтримку.');
        this.isSubmitting = false;
      },
    });
  }
}
