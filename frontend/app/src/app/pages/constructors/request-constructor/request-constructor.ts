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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RequestConstructorService } from './request-constructor.service';
import { Category } from './request-constructor.model';

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
export class RequestConstructor implements OnInit {
  private fb = inject(FormBuilder);
  private ticketService = inject(RequestConstructorService);
  private router = inject(Router);

  isLoading = signal(false);
  serverError = signal<string | null>(null);
  categories = signal<Category[]>([]);

  form = this.fb.group({
    title: ['', [Validators.required, notBlank, Validators.maxLength(200)]],
    description: ['', [Validators.required, notBlank, Validators.maxLength(2000)]],
    category_id: [null as number | null, [Validators.required]],
    priority: [''],
    file_url: [''],
    file_name: [null as string | null],
    file_preview: [null as string | null],
    location: this.fb.group(
      {
        city: ['', [Validators.maxLength(100)]],
        address: ['', [Validators.maxLength(200)]],
        region: ['', [Validators.maxLength(100)]],
        lat: [null as number | null],
        lng: [null as number | null],
      },
      { validators: locationValidator },
    ),
  });

  get title() {
    return this.form.controls.title;
  }
  get description() {
    return this.form.controls.description;
  }
  get category_id() {
    return this.form.controls.category_id;
  }
  get priority() {
    return this.form.controls.priority;
  }
  get file_url() {
    return this.form.controls.file_url;
  }
  get file_name() {
    return this.form.controls.file_name;
  }
  get file_preview() {
    return this.form.controls.file_preview;
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
  get lat() {
    return this.locationGroup.controls['lat'];
  }
  get lng() {
    return this.locationGroup.controls['lng'];
  }

  isInvalid(ctrl: AbstractControl): boolean {
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  ngOnInit(): void {
    this.ticketService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => {},
    });

    this.ticketService.getMyProfile().subscribe({
      next: (profile) => {
        if (profile?.location) {
          this.locationGroup.patchValue(profile.location);
        }
      },
      error: () => {},
    });

    this.locationGroup.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged(
          (a, b) => a.city === b.city && a.address === b.address && a.region === b.region,
        ),
      )
      .subscribe(() => this.geocode());
  }

  geocode(): void {
    const loc = this.locationGroup.getRawValue();
    const query = [loc.address, loc.city, loc.region].filter(Boolean).join(', ');
    if (!query.trim()) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
    )
      .then((r) => r.json())
      .then((results: { lat: string; lon: string }[]) => {
        if (results?.[0]) {
          this.locationGroup.patchValue(
            {
              lat: parseFloat(results[0].lat),
              lng: parseFloat(results[0].lon),
            },
            { emitEvent: false },
          );
        }
      })
      .catch(() => {});
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
    const hasLocation = !!(loc.city?.trim() && loc.address?.trim() && loc.region?.trim());

    const payload = {
      title: v.title!,
      description: v.description!,
      category_id: Number(v.category_id!),
      ...(v.priority ? { priority: v.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' } : {}),
      ...(v.file_url ? { file_url: v.file_url } : {}),
      ...(hasLocation && {
        location: {
          city: loc.city!,
          address: loc.address!,
          region: loc.region!,
          ...(loc.lat !== null && loc.lng !== null
            ? {
                lat: Number(loc.lat),
                lng: Number(loc.lng),
              }
            : {}),
        },
      }),
    };

    this.isLoading.set(true);
    this.serverError.set(null);

    this.ticketService.createTicket(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        void this.router.navigate(['/profile-user']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading.set(false);
        this.serverError.set(err?.error?.message ?? 'Помилка створення запиту. Спробуйте ще раз.');
      },
    });
  }
}
