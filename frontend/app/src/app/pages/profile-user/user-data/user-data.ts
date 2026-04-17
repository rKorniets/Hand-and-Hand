import {Component, Input} from '@angular/core';
import {AppUser} from '../profile-user.model';

@Component({
  selector: 'app-user-data',
  imports: [],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
})
export class UserData {
  @Input() user?: AppUser;
}
