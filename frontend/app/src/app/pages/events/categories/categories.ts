import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  categoriesListEvents: string[] = [
    'Музика',
    'Спорт',
    'Мистецтво',
    'Освіта',
    'Технології',
  ];

  categoriesStatusEvents: string[] = [
    'Активні',
    'Завершені',
    'Скасовані',
  ];

  uniqueCities: string[] = [
    'Київ',
    'Львів',
    'Харків',
    'Одеса',
    'Дніпро',
  ];
}
