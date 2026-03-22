import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../events.service';
import { Location } from '../location.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  // Змінні для дат
  startDate: string = '';
  endDate: string = '';

  // Змінні для міст
  selectedCity: string = '';
  uniqueCities: string[] = [];

  // Твої категорії
  categoriesListEvents: string[] = [
    'Соціальна допомога',
    'Допомога ЗСУ та ветеранам',
    'Ментальне здоров`я',
    'Екологія та довкілля',
    'Урбаністика та місто',
    'Освіта та саморозвиток',
    'Культура та мистецтво',
  ];

  categoriesStatusEvents: string[] = [
    'Активні',
    'Завершені',
  ];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadCities();
  }

  loadCities(): void {
    this.locationService.getLocations().subscribe({
      next: (data: Location[]) => {
        const region = data.map(loc => loc.region);
        this.uniqueCities = [...new Set(region)].sort();
      }
    });
  }
}
