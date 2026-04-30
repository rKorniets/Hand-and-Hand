import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUser } from '../profile-user.model';
import { UserProfileService } from '../profile-user.service';
import { HttpClient } from '@angular/common/http';
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
    private profileService: UserProfileService,
    private http: HttpClient,
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
    img.src = 'images/default-avatar.jpg';
  }

  async onAvatarSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploading = true;
    this.cdr.detectChanges();
    this.uploadError = null;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const updatedUser = await firstValueFrom(
        this.http.post<AppUser>('http://localhost:3000/app-users/me/avatar', formData),
      );

      if (this.user) {
        this.user.avatar_url = updatedUser.avatar_url;
      }
      this.avatarUpdated.emit(updatedUser.avatar_url ?? '');
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
      await firstValueFrom(this.profileService.deleteAvatar());

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
