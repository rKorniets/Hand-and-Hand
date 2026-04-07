import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from "@angular/common";
import { AppUser, ActivityItem } from '../profile-user.model';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [ DatePipe, RouterLink, CommonModule],
  templateUrl: './activity.html',
  styleUrl: './activity.scss',
})
export class Activity {
  @Input() user?: AppUser;
  isExpanded: boolean = false;

  activities: ActivityItem[] = [
    {
      id: 1,
      title: 'Подія: Допомога пухнастикам міського притулку',
      starts_at: new Date('2026-03-13T10:00:00Z'),
      location: 'Львів',
      description: 'В міському притулку було проведено благодійний захід для собак і котів, які шукають домівку. Кожен охочий міг взяти тварину на прогулянку...'
    },
    {
      id: 2,
      title: 'Допомога пенсіонеру',
      starts_at: new Date('2026-03-13T10:00:00Z'),
      location: 'Львів',
      description: 'Відгукнувся на заявку про допомогу Марії Михайлівні. Придбав цокольні лампи та обігрівач для пенсіонерки, щоб їй було легше при відключеннях світла або опалення.'
    },
    {
      id: 3,
      title: 'Подія: Допомога пухнастикам міського притулку',
      starts_at: new Date('2026-03-13T10:00:00Z'),
      location: 'Львів',
      description: 'В міському притулку було проведено благодійний захід для собак і котів, які шукають домівку. Кожен охочий міг взяти тварину на прогулянку...'
    },
    {
      id: 4,
      title: 'Подія: Допомога пухнастикам міського притулку',
      starts_at: new Date('2026-03-13T10:00:00Z'),
      location: 'Львів',
      description: 'В міському притулку було проведено благодійний захід для собак і котів, які шукають домівку. Кожен охочий міг взяти тварину на прогулянку...'
    },
    {
      id: 5,
      title: 'Подія: Допомога пухнастикам міського притулку',
      starts_at: new Date('2026-03-13T10:00:00Z'),
      location: 'Львів',
      description: 'В міському притулку було проведено благодійний захід для собак і котів, які шукають домівку. Кожен охочий міг взяти тварину на прогулянку...'
    },
    {
      id: 6,
      title: 'Подія: Допомога пухнастикам міського притулку',
      starts_at: new Date('2026-03-13T10:00:00Z'),
      location: 'Львів',
      description: 'В міському притулку було проведено благодійний захід для собак і котів, які шукають домівку. Кожен охочий міг взяти тварину на прогулянку...'
    },
  ];

  toggleActivities(target: HTMLElement) {
    this.isExpanded = !this.isExpanded;

    setTimeout(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }
}
