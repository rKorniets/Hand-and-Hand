import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vol-verification',
  templateUrl: './vol-verification.html',
  styleUrl: './vol-verification.scss',
  imports: [FormsModule],
})
export class VolVerification {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  loading = false;
  error = '';
  edrpou = '';
  uploadedFile: File | null = null;

  constructor(private router: Router) {}

  private validateEdrpou(edrpou: string): string | null {
    if (!edrpou) return 'Це поле є обовʼязковим';
    if (!/^\d{8}$/.test(edrpou)) return 'ЄДРПОУ має містити рівно 8 цифр';
    return null;
  }

  onFileChange() {
    const file = this.fileInput.nativeElement.files?.[0];
    if (file) this.uploadedFile = file;
  }

  onSubmit() {
    const validationError = this.validateEdrpou(this.edrpou);
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.error = '';
    this.loading = true;
    this.router.navigate(['/application-submitted']);  }
}
