import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; //*ngFor

@Component({
  selector: 'app-list-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-events.html',
  styleUrl: './list-events.scss',
})
export class ListEvents {}
