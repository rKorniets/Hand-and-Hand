import { Component } from '@angular/core';
import { CategoriesOrg } from "./categories-org/categories-org";
import { ListOrgComponent } from './list-org/list-org';
import { Organization as OrgModel } from './organizations.model';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [ CategoriesOrg, ListOrgComponent ],
  templateUrl: './organizations.html',
  styleUrl: './organizations.scss',
})
export class OrganizationsPage {

  public testOrganizations: OrgModel[] = [
    {
      id: 1,
      user_id: 101,
      name: 'Допомога планеті',
      description: 'Екологічна організація, що займається очищенням річок.',
      verification_status: 'VERIFIED',
      contact_phone: '+380 67 111 22 33',
      contact_email: 'eco.help@gmail.com',
      location: {
        id: 1,
        address: 'вул. Шевченка, 1',
        region: 'Львівська область',
        city: 'Львів'
      },
      mission: 'Боротися за право кожного дихати чистим повітрям та пити чисту воду.',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      user_id: 102,
      name: 'Нитка Часу',
      description: 'Підтримка людей похилого віку та ветеранів.',
      verification_status: 'VERIFIED',
      contact_phone: '+380 50 444 55 66',
      contact_email: 'time.thread@gmail.com',
      location: {
        id: 1,
        address: 'вул. Шевченка, 1',
        region: 'Львівська область',
        city: 'Львів'
      },
      mission: 'Подолання соціальної ізоляції літніх людей через спільну творчість.',
      created_at: '2023-11-20'
    },
    {
      id: 3,
      user_id: 103,
      name: 'Оберіг',
      description: 'Волонтерський фонд допомоги захисникам.',
      verification_status: 'PENDING',
      contact_phone: '+380 93 777 88 99',
      contact_email: 'oberig.fond@ukr.net',
      location: {
        id: 1,
        address: 'вул. Шевченка, 1',
        region: 'Львівська область',
        city: 'Львів'
      },
      mission: 'Забезпечуємо технологічну перевагу нашим захисникам на передовій.',
      created_at: '2024-02-10'
    },
    {
      id: 4,
      user_id: 104,
      name: "Відчуй зв'язок",
      description: 'Розвиток медіаграмотності та інклюзивного спілкування.',
      verification_status: 'REJECTED',
      contact_phone: '+380 63 000 11 22',
      contact_email: 'connection@gmail.com',
      location: {
        id: 1,
        address: 'вул. Шевченка, 1',
        region: 'Львівська область',
        city: 'Львів'
      },
      mission: 'Створюємо простір спілкування для усіх людей незалежно від обмежень.',
      created_at: '2024-03-01'
    }
  ];
}
