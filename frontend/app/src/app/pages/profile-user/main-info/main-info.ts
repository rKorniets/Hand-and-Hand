import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUser } from '../profile-user.model';

@Component({
  selector: 'app-main-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-info.html',
  styleUrl: './main-info.scss',
})
export class MainInfo {
  @Input() user: AppUser | undefined | null = null;
}
