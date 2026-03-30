import { Component } from '@angular/core';

@Component({
  selector: 'app-categories-org',
  imports: [],
  templateUrl: './categories-org.html',
  styleUrl: './categories-org.scss',
})
export class CategoriesOrg {
  categories: string[] = [
    'Екологія та довкілля',
    'Мілітарні та ветеранські',
    'Діти та молодь',
    'Гуманітарна допомога та соцзахист',
    'Культура та збереження спадщини',
    'Правозахист та медіаграмотність',
  ];
}
