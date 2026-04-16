import { Component, Input } from '@angular/core';
import { AppUser } from '../profile-user.model';

@Component({
  selector: 'app-main-info',
  imports: [ ],
  templateUrl: './main-info.html',
  styleUrl: './main-info.scss',
})
export class MainInfo {
  @Input() user: AppUser | undefined;
}
