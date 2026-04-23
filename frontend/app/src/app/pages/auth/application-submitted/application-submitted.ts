import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-submitted',
  templateUrl: './application-submitted.html',
  styleUrl: './application-submitted.scss',
})
export class ApplicationSubmitted {
  constructor(private router: Router) {}

  goToProfile() {
    this.router.navigate(['/profile-user']);
  }
}
