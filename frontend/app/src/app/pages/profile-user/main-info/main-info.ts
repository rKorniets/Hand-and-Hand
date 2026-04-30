import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUser } from '../profile-user.model';
import { MainInfoService } from './main-info.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-main-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-info.html',
  styleUrl: './main-info.scss',
})
export class MainInfo {
  @Input() user: AppUser | undefined | null = null;
  @Output() avatarUpdated = new EventEmitter<string>();

  uploading = false;
  uploadError: string | null = null;
  menuOpen = false;

  constructor(
    private mainInfoService: MainInfoService,
    private cdr: ChangeDetectorRef,
  ) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'images/default-avatar.png';
  }

  async onAvatarSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploading = true;
    this.cdr.detectChanges();
    this.uploadError = null;

    try {
      const avatarUrl = await firstValueFrom(this.mainInfoService.uploadAvatar(file));

      if (this.user) {
        this.user.avatar_url = avatarUrl;
      }
      this.avatarUpdated.emit(avatarUrl);
    } catch (err) {
      this.uploadError = 'Помилка завантаження. Спробуй ще раз.';
      console.error(err);
    } finally {
      this.uploading = false;
      this.cdr.detectChanges();
    }
  }

  async onAvatarDelete(): Promise<void> {
    try {
      await firstValueFrom(this.mainInfoService.deleteAvatar());

      if (this.user) {
        this.user.avatar_url = null;
      }
      this.avatarUpdated.emit('');
      this.cdr.detectChanges();
    } catch (err) {
      console.error(err);
    }
  }
}
