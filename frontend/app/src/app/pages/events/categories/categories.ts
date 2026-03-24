import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  startDate: string = '';
  endDate: string = '';
}
