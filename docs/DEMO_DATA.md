# Демо-дані для презентації

Цей документ описує як заповнити базу демонстраційними даними для тестування / показу роботи Hand&Hand.

---

## Запуск seed

Скрипт лежить у `prisma/seed.sql`. Виконується через Prisma CLI (бере `DATABASE_URL` з `.env` автоматично):

```powershell
# з кореня репозиторію
npx prisma db execute --file prisma/seed.sql
```

> **Перед першим запуском** треба синхронізувати схему з БД:
>
> ```powershell
> npx prisma db push
> ```
>
> Якщо БД у поганому стані — `npx prisma migrate reset` (⚠️ знищить дані).

Скрипт повністю **ідемпотентний**: усередині `TRUNCATE ... RESTART IDENTITY CASCADE`, тож можна перезапускати скільки завгодно — попередні демо-дані затруться, sequences скинуться.

### Альтернативи (якщо `prisma db execute` не працює)

```powershell
# через psql напряму (якщо PostgreSQL у PATH):
psql "$env:DATABASE_URL" -f prisma/seed.sql

# через повний шлях до psql.exe (якщо не в PATH):
& "<path-to-postgresql>\bin\psql.exe" "$env:DATABASE_URL" -f prisma/seed.sql
```

---

## Демо-логіни

**Пароль для всіх юзерів:** `Demo1234!`

⚠️ Зверни увагу на регістр і знак оклику в кінці — пароль чутливий до регістру.

| Email                   | Роль           | Профіль                                                                                |
| ----------------------- | -------------- | -------------------------------------------------------------------------------------- |
| `admin@demo.local`      | `ADMIN`        | Super-admin. Доступ до `/profile/admin` і модерації заявок.                            |
| `org-rescue@demo.local` | `ORGANIZATION` | Власник «Rescue Львів» — зоозахисна організація. Може створювати події, збори, новини. |
| `org-eco@demo.local`    | `ORGANIZATION` | Власник «EcoKyiv» — екологічна організація.                                            |
| `vol-anna@demo.local`   | `VOLUNTEER`    | AnnaHelper. Верифікована, 120 балів, рейтинг 4.80.                                     |
| `vol-petro@demo.local`  | `VOLUNTEER`    | PetroDoer. Верифікований, 80 балів, член EcoKyiv.                                      |
| `user@demo.local`       | `APP_USER`     | Марія Бойко. Звичайний юзер без волонтерського/орг. профілю.                           |

---

## Що в базі після seed

| Сутність            | К-сть | Опис                                                                                        |
| ------------------- | ----- | ------------------------------------------------------------------------------------------- |
| Локації             | 5     | Львів, Київ, Тернопіль, Одеса, Івано-Франківськ                                             |
| Категорії           | 10    | Екологія, Тварини, Освіта, Медицина, Армія, Соцдопомога, Культура, Діти, Літні, Переселенці |
| Юзери               | 6     | див. таблицю вище                                                                           |
| Організації         | 2     | Rescue Львів, EcoKyiv (обидві VERIFIED)                                                     |
| Проекти/події       | 4     | 3 ACTIVE + 1 DRAFT                                                                          |
| Реєстрації на події | 5     | різні статуси                                                                               |
| Новини              | 3     | 1 закріплена + 2 звичайні                                                                   |
| Збори               | 3     | ACTIVE / COMPLETED / від волонтера                                                          |
| Донати              | 9     | різні суми, іменні + анонімні                                                               |
| Approval requests   | 10    | усі APPROVED крім DRAFT-проекту                                                             |
| Tasks               | 2     | мікрозавдання в межах проектів                                                              |
| Rewards             | 4     | стікери, футболка, кружка, сертифікат                                                       |
| Points transactions | 4     | історія нарахування балів                                                                   |
| Membership requests | 2     | REQUEST + INVITE                                                                            |

---

## Регенерація argon2 хешу

Якщо хочеш змінити пароль для демо-юзерів — згенеруй новий хеш через ту саму бібліотеку що в `auth.service.ts`:

```powershell
cd backend/server
node -e "require('argon2').hash('YourNewPassword').then(console.log)"
```

Скопіюй вивід (формат `$argon2id$v=19$m=65536...`) і встав замість поточного хешу в `prisma/seed.sql` (повторюється для 6 юзерів — найпростіше Find & Replace).

---

## Швидкі перевірки після seed

```sql
-- Юзери
SELECT email, role, status FROM app_user;

-- Організації
SELECT id, name, verification_status FROM organization_profile;

-- Проекти + статус
SELECT id, title, status FROM project;

-- Збори + сума
SELECT id, title, current_amount, goal_amount, status FROM fundraising_campaign;
```
