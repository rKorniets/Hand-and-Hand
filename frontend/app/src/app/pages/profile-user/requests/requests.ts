import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUser, ITicket } from '../profile-user.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class Requests implements OnInit {
  @Input() user?: AppUser;
  isExpanded: boolean = false;

  requests: ITicket[] = [
    {
      id: 1,
      title: 'Потрібні кошти на ремонт вольєрів!',
      description: 'Просимо допомогти відкрити збір на ремонт старих вольєрів для собак. Утримання тварин в них майже неможливо, потрібна термінова заміна сіток!',
      status: 'OPEN',
      city: 'Львів',
      created_at: '22.03.2026'
    },
    {
      id: 2,
      title: 'Потрібна допомога з організацією заходу для всиновлення!',
      description: 'Плануємо провести захід з виставкою тварин, щоб більше людей побачили наших пухнастиків та взяли їх додому. Орієнтовно в квітні, але потребуємо людей!!',
      status: 'IN_REVIEW',
      city: 'Львів',
      created_at: '15.03.2026'
    },
    {
      id: 3,
      title: 'Потрібно знайти ветеринара!',
      description: 'Шукаємо ветеринара для періодичних оглядів тваринок!',
      status: 'CLOSED',
      city: 'Львів',
      created_at: '22.03.2026',
      closed_at: new Date('2026-03-23')
    },
    {
      id: 4,
      title: 'Корм для притулку "Щасливий хвіст"',
      description: 'Закінчується сухий корм для дорослих собак. Будемо вдячні за будь-яку кількість.',
      status: 'OPEN',
      city: 'Київ',
      created_at: '01.04.2026'
    }
  ];

  ngOnInit(): void {}

  isClosed(status: string): boolean {
    return status === 'CLOSED' || status === 'RESOLVED' || status === 'CANCELLED';
  }

  toggleRequests(target: HTMLElement) {
    this.isExpanded = !this.isExpanded;

    if (target) {
      setTimeout(() => {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }
}
