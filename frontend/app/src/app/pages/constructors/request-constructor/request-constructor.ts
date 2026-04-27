import { Component, inject, signal, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RequestConstructorService } from './request-constructor.service';

function notBlank(control: AbstractControl): ValidationErrors | null {
  return control.value?.trim().length ? null : { blank: true };
}

function locationValidator(group: AbstractControl): ValidationErrors | null {
  const city = group.get('city')?.value?.trim();
  const address = group.get('address')?.value?.trim();
  const region = group.get('region')?.value?.trim();
  const filled = [city, address, region].filter(Boolean).length;
  if (filled === 0 || filled === 3) return null;
  return { locationIncomplete: true };
}

@Component({
  selector: 'app-request-constructor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './request-constructor.html',
  styleUrl: './request-constructor.scss',
})
export class RequestConstructorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private requestService = inject(RequestConstructorService);
  private router = inject(Router);

  isLoading = signal(false);
  serverError = signal<string | null>(null);
  categories: { id: number; name: string }[] = [];
  profileLocation = signal<{ city: string; address: string; region: string } | null>(null);
  useProfileLocation = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, notBlank, Validators.maxLength(200)]],
    description: ['', [Validators.required, notBlank, Validators.maxLength(2000)]],
    category: [''],
    file_url: [''],
    file_name: [null as string | null],
    file_preview: [null as string | null],
    location: this.fb.group(
      {
        city: ['', [Validators.maxLength(100)]],
        address: ['', [Validators.maxLength(200)]],
        region: ['', [Validators.maxLength(100)]],
      },
      { validators: locationValidator },
    ),
  });
  get file_name() {
    return this.form.controls.file_name;
  }
  get file_preview() {
    return this.form.controls.file_preview;
  }
  get title() {
    return this.form.controls.title;
  }
  get description() {
    return this.form.controls.description;
  }
  get category() {
    return this.form.controls.category;
  }
  get file_url() {
    return this.form.controls.file_url;
  }
  get locationGroup() {
    return this.form.controls.location as FormGroup;
  }
  get city() {
    return this.locationGroup.controls['city'];
  }
  get address() {
    return this.locationGroup.controls['address'];
  }
  get region() {
    return this.locationGroup.controls['region'];
  }

  isInvalid(ctrl: AbstractControl): boolean {
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  ngOnInit(): void {
    this.requestService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: () => {},
    });

    this.requestService.getMyProfile().subscribe({
      next: (profile) => {
        if (profile?.location) {
          this.profileLocation.set(profile.location);
        }
      },
      error: () => {},
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.file_name.setValue(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.file_preview.setValue(base64);
      this.file_url.setValue(base64);
      this.file_url.markAsDirty();
      this.file_url.markAsTouched();
    };
    reader.readAsDataURL(file);
  }

  removeFile(): void {
    this.file_name.setValue(null);
    this.file_preview.setValue(null);
    this.file_url.setValue('');
    this.file_url.markAsTouched();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const loc = this.locationGroup.getRawValue();

    const payload = {
      title: v.title!,
      description: v.description!,
      ...(v.category ? { category_id: Number(v.category) } : {}),
      ...(v.file_url ? { file_url: v.file_url } : {}),
      location: {
        city: loc.city!,
        address: loc.address!,
        region: loc.region!,
      },
    };

    this.isLoading.set(true);
    this.serverError.set(null);

    this.requestService.createRequest(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        void this.router.navigate(['/request']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading.set(false);
        this.serverError.set(err?.error?.message ?? 'Помилка створення запиту. Спробуйте ще раз.');
      },
    });
  }
}
