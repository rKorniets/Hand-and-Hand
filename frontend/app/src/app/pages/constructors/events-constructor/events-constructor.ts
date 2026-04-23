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
import { EventsConstructorService } from './events-constructor.service';
import { project_status_enum } from './events-constructor.model';
import { AuthService } from '../../auth/auth.service';
import { jwtDecode } from 'jwt-decode';

function notBlank(control: AbstractControl): ValidationErrors | null {
  return control.value?.trim().length ? null : { blank: true };
}

function notPastDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today ? null : { pastDate: true };
}

function validTimeFormat(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(control.value) ? null : { invalidTime: true };
}

function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('starts_at')?.value;
  const end = group.get('ends_at')?.value;
  if (!start || !end) return null;
  return new Date(end) >= new Date(start) ? null : { endBeforeStart: true };
}

function deadlineBeforeStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('starts_at')?.value;
  const deadline = group.get('application_deadline')?.value;
  if (!start || !deadline) return null;
  return new Date(deadline) <= new Date(start) ? null : { deadlineAfterStart: true };
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
  selector: 'app-events-constructor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './events-constructor.html',
  styleUrl: './events-constructor.scss',
})
export class EventsConstructorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventsConstructorService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  serverError = signal<string | null>(null);
  categories: { id: number; name: string }[] = [];
  selectedFileName = signal<string | null>(null);
  selectedFilePreview = signal<string | null>(null);

  form = this.fb.group(
    {
      title: ['', [Validators.required, notBlank, Validators.maxLength(200)]],
      category: [''],
      description: ['', [Validators.required, notBlank, Validators.maxLength(2000)]],
      what_volunteers_will_do: ['', [Validators.required, notBlank, Validators.maxLength(5000)]],
      why_its_important: ['', [Validators.required, notBlank, Validators.maxLength(5000)]],
      status: ['DRAFT' as project_status_enum],
      starts_at: ['', [Validators.required, notPastDate]],
      ends_at: ['', [Validators.required, notPastDate]],
      time: ['', [Validators.required, validTimeFormat]],
      application_deadline: ['', [Validators.required, notPastDate]],
      partners: ['', Validators.maxLength(500)],
      image_url: ['', Validators.required],
      location: this.fb.group(
        {
          city: ['', [Validators.required, Validators.maxLength(100)]],
          address: ['', [Validators.required, Validators.maxLength(200)]],
          region: ['', [Validators.required, Validators.maxLength(100)]],
        },
        { validators: locationValidator },
      ),
    },
    { validators: [endAfterStart, deadlineBeforeStart] },
  );

  get title() {
    return this.form.controls.title;
  }
  get category() {
    return this.form.controls.category;
  }
  get description() {
    return this.form.controls.description;
  }
  get what_volunteers_will_do() {
    return this.form.controls.what_volunteers_will_do;
  }
  get why_its_important() {
    return this.form.controls.why_its_important;
  }
  get starts_at() {
    return this.form.controls.starts_at;
  }
  get ends_at() {
    return this.form.controls.ends_at;
  }
  get time() {
    return this.form.controls.time;
  }
  get application_deadline() {
    return this.form.controls.application_deadline;
  }
  get partners() {
    return this.form.controls.partners;
  }
  get image_url() {
    return this.form.controls.image_url;
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
    this.eventService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: () => {},
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFileName.set(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.selectedFilePreview.set(base64);
      this.image_url.setValue(base64);
      this.image_url.markAsDirty();
      this.image_url.markAsTouched();
    };
    reader.readAsDataURL(file);
  }

  removeFile(): void {
    this.selectedFileName.set(null);
    this.selectedFilePreview.set(null);
    this.image_url.setValue('');
    this.image_url.markAsTouched();
  }

  private getOrgProfileId(): number | null {
    const token = this.authService.getToken();
    if (!token) return null;
    try {
      const payload = jwtDecode<{ organization_profile_id?: number }>(token);
      return payload.organization_profile_id ?? null;
    } catch {
      return null;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const orgProfileId = this.getOrgProfileId();
    if (!orgProfileId) {
      this.serverError.set('Не вдалося визначити організацію. Увійдіть знову.');
      return;
    }

    const v = this.form.value;
    const loc = v.location;

    const payload = {
      organization_profile_id: orgProfileId,
      title: v.title!,
      description: v.description!,
      ...(v.category ? { category_id: Number(v.category) } : {}),
      what_volunteers_will_do: v.what_volunteers_will_do || undefined,
      why_its_important: v.why_its_important || undefined,
      status: (v.status ?? 'DRAFT') as project_status_enum,
      time: v.time || undefined,
      application_deadline: v.application_deadline || undefined,
      partners: v.partners || undefined,
      image_url: v.image_url || undefined,
      ...(v.starts_at && { starts_at: new Date(v.starts_at).toISOString() }),
      ...(v.ends_at && { ends_at: new Date(v.ends_at).toISOString() }),
      location: {
        city: loc!.city!,
        address: loc!.address!,
        region: loc!.region!,
      },
    };

    this.isLoading.set(true);
    this.serverError.set(null);

    this.eventService.createProject(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        void this.router.navigate(['/events']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading.set(false);
        this.serverError.set(err?.error?.message ?? 'Помилка створення події. Спробуйте ще раз.');
      },
    });
  }
}
