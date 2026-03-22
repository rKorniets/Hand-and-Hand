import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  categoriesListFun: string[] = [
    'Мілітарна допомога',
    'Медицина та реабілітація',
    'Гуманітарна допомога',
    'Екологія та тварини',
    'Правозахист та громада',
    'Освіта та майбутнє',
  ];

  categoriesStatusFun: string[] = [
    'Активні',
    'Завершені',
  ];

}
