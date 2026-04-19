import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUser } from '../profile-user.model';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
})
export class UserData {
  @Input() user?: AppUser;
}
