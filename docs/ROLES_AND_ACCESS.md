# Hand&Hand — Ролі та доступ

## Огляд

Проект використовує RBAC з JWT-автентифікацією. Бекенд — NestJS, БД — PostgreSQL (Prisma ORM).

---

## Ролі користувачів

| Роль           | Опис                                                   | Профіль                |
| -------------- | ------------------------------------------------------ | ---------------------- |
| `APP_USER`     | Звичайний користувач (за замовчуванням при реєстрації) | —                      |
| `VOLUNTEER`    | Волонтер                                               | `volunteer_profile`    |
| `ORGANIZATION` | Організація                                            | `organization_profile` |
| `ADMIN`        | Адміністратор                                          | `admin_profile`        |

### Супер-адмін

В таблиці `admin_profile` є поле `is_super_admin`. Супер-адмін має додаткові привілеї (наприклад, зміна ролей користувачів). Перевіряється через `SuperAdminGuard`.

---

## Статуси користувачів

| Статус     | Опис                                              |
| ---------- | ------------------------------------------------- |
| `ACTIVE`   | Активний (для користувачів при реєстрації)        |
| `PENDING`  | Очікує активації (для організацій при реєстрації) |
| `INACTIVE` | Деактивований                                     |
| `BLOCKED`  | Заблокований                                      |

---

## Автентифікація

- **JWT Bearer Token** — `Authorization: Bearer <token>`
- **Термін дії:** 15 хвилин (`ACCESS_TOKEN_TTL`)
- **Хешування паролів:** Argon2
- **Адмін логіниться** через загальний `/auth/login/user` (окремого ендпоінта немає)

### JWT payload

```json
{
  "sub": "<user_id>",
  "email": "<email>",
  "role": "<user_role_enum>",
  "status": "<user_status_enum>"
}
```

### Ендпоїнти

| Метод | Шлях                          | Опис                                    |
| ----- | ----------------------------- | --------------------------------------- |
| POST  | `/auth/register/user`         | Реєстрація користувача (статус ACTIVE)  |
| POST  | `/auth/register/organization` | Реєстрація організації (статус PENDING) |
| POST  | `/auth/login/user`            | Логін користувача/волонтера/адміна      |
| POST  | `/auth/login/organization`    | Логін організації (ЄДРПОУ + password)   |
| GET   | `/auth/me`                    | Профіль поточного користувача           |

---

## Система контролю доступу

### Архітектура

Глобальні Guard-и (зареєстровані в `app.module.ts`):

1. **`JwtAuthGuard`** — перевіряє JWT (окрім `@Public()`)
2. **`RolesGuard`** — перевіряє роль (якщо вказано `@Roles(...)`)

Додаткові Guard-и (підключаються через `@UseGuards()` на окремих ендпоїнтах):

- **`SuperAdminGuard`** — перевіряє `admin_profile.is_super_admin` в БД

### Декоратори

| Декоратор          | Призначення                       |
| ------------------ | --------------------------------- |
| `@Public()`        | Доступний без автентифікації      |
| `@Roles(...roles)` | Доступний лише для вказаних ролей |
| `@CurrentUser()`   | Дані поточного користувача з JWT  |

### Потік

```
Запит -> JwtAuthGuard -> RolesGuard -> [SuperAdminGuard] -> Controller -> Service (ownership)
           |                |                |
           |                |                +- Якщо @UseGuards(SuperAdminGuard) ->
           |                |                   перевіряє is_super_admin в БД
           |                +- Якщо @Roles() не вказано -> пропускає
           |                   Якщо роль не в списку -> 403
           +- Якщо @Public() -> пропускає
              Якщо токен невалідний -> 401
```

---

## Матриця доступу — публічні ендпоїнти

### Користувачі (`/app-users`)

| Ендпоїнт         | Метод  | Доступ                  | Ownership                                        |
| ---------------- | ------ | ----------------------- | ------------------------------------------------ |
| `/app-users/:id` | GET    | ORGANIZATION, VOLUNTEER | Тільки свій профіль                              |
| `/app-users/:id` | PUT    | ORGANIZATION, VOLUNTEER | Тільки свій (email, first_name, last_name, city) |
| `/app-users/:id` | DELETE | ORGANIZATION, VOLUNTEER | Тільки свій                                      |

### Проєкти (`/projects`)

| Ендпоїнт        | Метод  | Доступ       | Ownership                          |
| --------------- | ------ | ------------ | ---------------------------------- |
| `/projects`     | GET    | Public       | —                                  |
| `/projects/:id` | GET    | Public       | —                                  |
| `/projects`     | POST   | ORGANIZATION | Через organization_profile.user_id |
| `/projects/:id` | PUT    | ORGANIZATION | Тільки свій                        |
| `/projects/:id` | DELETE | ORGANIZATION | Тільки свій                        |

### Профілі волонтерів (`/volunteer-profiles`)

| Ендпоїнт                                   | Метод  | Доступ    | Ownership                                                                                                       |
| ------------------------------------------ | ------ | --------- | --------------------------------------------------------------------------------------------------------------- |
| `/volunteer-profiles`                      | GET    | Public    | —                                                                                                               |
| `/volunteer-profiles/:id`                  | GET    | Public    | —                                                                                                               |
| `/volunteer-profiles`                      | POST   | VOLUNTEER | user_id з JWT                                                                                                   |
| `/volunteer-profiles/:id`                  | PUT    | VOLUNTEER | Тільки свій                                                                                                     |
| `/volunteer-profiles/:id`                  | PATCH  | VOLUNTEER | Тільки свій (також приймає `docs_url`)                                                                          |
| `/volunteer-profiles/:id`                  | DELETE | VOLUNTEER | Тільки свій                                                                                                     |
| `/volunteer-profiles/verification-request` | POST   | VOLUNTEER | Подати заявку на верифікацію. Перевіряє: `docs_url` заповнений, не верифікований, немає активної PENDING-заявки |

### Профілі організацій (`/organization-profiles`)

| Ендпоїнт                                 | Метод  | Доступ       | Ownership     |
| ---------------------------------------- | ------ | ------------ | ------------- |
| `/organization-profiles`                 | GET    | Public       | —             |
| `/organization-profiles/:id`             | GET    | Public       | —             |
| `/organization-profiles/by-user/:userId` | GET    | Public       | —             |
| `/organization-profiles/:id/projects`    | GET    | Public       | —             |
| `/organization-profiles/:id/reports`     | GET    | Public       | —             |
| `/organization-profiles/:id/members`     | GET    | Public       | —             |
| `/organization-profiles/:id/fundraising` | GET    | Public       | —             |
| `/organization-profiles`                 | POST   | ORGANIZATION | user_id з JWT |
| `/organization-profiles/:id`             | PUT    | ORGANIZATION | Тільки свій   |
| `/organization-profiles/:id`             | DELETE | ORGANIZATION | Тільки свій   |

### Членство в організаціях (`/organization-profiles/:id/membership-requests`, `/invitations`, `/members`)

Двобічний workflow: волонтер може подати заявку на вступ, а організація — надіслати запрошення. Зустрічний pending-запис (наприклад, організація запросила волонтера, який в свою чергу подав заявку) автоматично перетворюється на членство.

| Ендпоїнт                                                           | Метод  | Доступ       | Опис                                                                                                    |
| ------------------------------------------------------------------ | ------ | ------------ | ------------------------------------------------------------------------------------------------------- |
| `/organization-profiles/:id/membership-requests`                   | POST   | VOLUNTEER    | Подати заявку на вступ. Перевіряє: орг VERIFIED, юзер не в іншій орг, не власник.                       |
| `/organization-profiles/:id/membership-requests`                   | GET    | ORGANIZATION | Список заявок (тільки власник; `?status=PENDING\|ACCEPTED\|REJECTED\|CANCELLED`).                       |
| `/organization-profiles/:id/membership-requests/:requestId/accept` | PATCH  | ORGANIZATION | Прийняти заявку → `app_user.organization_id = :id`.                                                     |
| `/organization-profiles/:id/membership-requests/:requestId/reject` | PATCH  | ORGANIZATION | Відхилити заявку.                                                                                       |
| `/organization-profiles/:id/invitations`                           | POST   | ORGANIZATION | Запросити волонтера (body: `{ user_id }`). Перевіряє: цільовий юзер має роль VOLUNTEER, не в іншій орг. |
| `/organization-profiles/:id/invitations`                           | GET    | ORGANIZATION | Список надісланих запрошень (`?status=...`).                                                            |
| `/organization-profiles/me/invitations`                            | GET    | VOLUNTEER    | Мої pending-запрошення.                                                                                 |
| `/organization-profiles/me/invitations/:invitationId/accept`       | PATCH  | VOLUNTEER    | Прийняти запрошення → стати членом організації.                                                         |
| `/organization-profiles/me/invitations/:invitationId/reject`       | PATCH  | VOLUNTEER    | Відхилити запрошення.                                                                                   |
| `/organization-profiles/:id/members/:userId`                       | DELETE | ORGANIZATION | Видалити учасника з організації (власник не може видалити себе).                                        |
| `/organization-profiles/:id/members/me`                            | DELETE | VOLUNTEER    | Вийти з організації.                                                                                    |

### Новини (`/news`)

| Ендпоїнт    | Метод | Доступ |
| ----------- | ----- | ------ |
| `/news`     | GET   | Public |
| `/news/:id` | GET   | Public |

### Збори коштів (`/fundraising_campaigns`)

| Ендпоїнт                               | Метод  | Доступ                  | Ownership              |
| -------------------------------------- | ------ | ----------------------- | ---------------------- |
| `/fundraising_campaigns`               | GET    | Public                  | —                      |
| `/fundraising_campaigns`               | POST   | ORGANIZATION, VOLUNTEER | TODO: profile_id з JWT |
| `/fundraising_campaigns/:id`           | PUT    | ORGANIZATION, VOLUNTEER | Тільки свій            |
| `/fundraising_campaigns/:id`           | DELETE | ORGANIZATION, VOLUNTEER | Тільки свій            |
| `/fundraising_campaigns/:id/donations` | POST   | Public                  | —                      |

### Задачі (`/tasks`)

| Ендпоїнт     | Метод  | Доступ       | Ownership                                     |
| ------------ | ------ | ------------ | --------------------------------------------- |
| `/tasks`     | GET    | Public       | —                                             |
| `/tasks/:id` | GET    | Public       | —                                             |
| `/tasks`     | POST   | ORGANIZATION | Через project -> organization_profile.user_id |
| `/tasks/:id` | PATCH  | ORGANIZATION | Тільки свій                                   |
| `/tasks/:id` | DELETE | ORGANIZATION | Тільки свій                                   |

### Призначення задач (`/task-assignments`)

| Ендпоїнт                | Метод  | Доступ                  | Ownership                                 |
| ----------------------- | ------ | ----------------------- | ----------------------------------------- |
| `/task-assignments`     | GET    | ORGANIZATION, VOLUNTEER | —                                         |
| `/task-assignments/:id` | GET    | ORGANIZATION, VOLUNTEER | —                                         |
| `/task-assignments`     | POST   | VOLUNTEER               | `volunteer_profile_id` визначається з JWT |
| `/task-assignments/:id` | PUT    | VOLUNTEER               | Тільки свій                               |
| `/task-assignments/:id` | DELETE | VOLUNTEER               | Тільки свій                               |

### Тікети (`/tickets`)

| Ендпоїнт       | Метод | Доступ    | Ownership                               |
| -------------- | ----- | --------- | --------------------------------------- |
| `/tickets`     | GET   | Public    | —                                       |
| `/tickets/:id` | GET   | Public    | —                                       |
| `/tickets`     | POST  | VOLUNTEER | volunteer_profile.user_id перевіряється |

### Попередження (`/warnings`)

| Ендпоїнт        | Метод | Доступ                  | Ownership                   |
| --------------- | ----- | ----------------------- | --------------------------- |
| `/warnings`     | GET   | ORGANIZATION, VOLUNTEER | Волонтер бачить тільки свої |
| `/warnings/:id` | GET   | ORGANIZATION, VOLUNTEER | Волонтер бачить тільки свої |

### Звіти (`/reports`)

| Ендпоїнт       | Метод  | Доступ       | Ownership                                         |
| -------------- | ------ | ------------ | ------------------------------------------------- |
| `/reports`     | GET    | Public       | —                                                 |
| `/reports/:id` | GET    | Public       | —                                                 |
| `/reports`     | POST   | ORGANIZATION | Через organization_profile.user_id                |
| `/reports/:id` | PUT    | ORGANIZATION | Тільки свій (title, type, file_url, published_at) |
| `/reports/:id` | DELETE | ORGANIZATION | Тільки свій                                       |

### Нагороди (`/rewards`)

| Ендпоїнт       | Метод | Доступ |
| -------------- | ----- | ------ |
| `/rewards`     | GET   | Public |
| `/rewards/:id` | GET   | Public |

### Категорії (`/categories`)

| Ендпоїнт          | Метод | Доступ |
| ----------------- | ----- | ------ |
| `/categories`     | GET   | Public |
| `/categories/:id` | GET   | Public |

### Локації (`/locations`)

| Ендпоїнт         | Метод | Доступ       |
| ---------------- | ----- | ------------ |
| `/locations`     | GET   | Public       |
| `/locations/:id` | GET   | Public       |
| `/locations`     | POST  | ORGANIZATION |

### Завантаження файлів (`/upload`)

Усі файли вантажаться напряму в Cloudinary, бекенд повертає публічний `secure_url`. На диску сервера нічого не зберігається.

| Ендпоїнт           | Метод | Доступ                                   | Опис                                                  |
| ------------------ | ----- | ---------------------------------------- | ----------------------------------------------------- |
| `/upload/image`    | POST  | ADMIN, ORGANIZATION, VOLUNTEER, APP_USER | JPG/PNG, до 5MB, папка `hand-and-hand`                |
| `/upload/document` | POST  | ADMIN, ORGANIZATION, VOLUNTEER, APP_USER | JPG/PNG/PDF, до 10MB, папка `hand-and-hand/documents` |

Тіло — `multipart/form-data` з полем `file`. Відповідь — `{ "url": "..." }`.

---

## Адмін-модуль (`/admin/*`)

Всі ендпоїнти адмін-модуля захищені `@Roles(ADMIN)`. Адмін-логіка повністю відділена від звичайних контролерів.

### Заявки на підтвердження (`/admin/approvals`)

| Ендпоїнт                       | Метод | Опис                                                                                                                |
| ------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------- |
| `/admin/approvals`             | GET   | Список заявок (фільтр: type, status)                                                                                |
| `/admin/approvals/:id`         | GET   | Деталі заявки + поле `entity` (підвантажена сутність за `type`: volunteer_profile / organization_profile / project) |
| `/admin/approvals/:id/approve` | PATCH | Підтвердити заявку. Для `VOLUNTEER` автоматично виставляє `volunteer_profile.is_verified = true`                    |
| `/admin/approvals/:id/reject`  | PATCH | Відхилити заявку (з причиною). `is_verified` залишається `false`                                                    |

### Користувачі (`/admin/users`)

| Ендпоїнт                  | Метод | Опис                                      | Обмеження       |
| ------------------------- | ----- | ----------------------------------------- | --------------- |
| `/admin/users`            | GET   | Список (пошук, фільтр role/status)        | —               |
| `/admin/users/:id`        | GET   | Повна інформація + профілі + попередження | —               |
| `/admin/users/:id/status` | PATCH | Змінити статус (ACTIVE/BLOCKED/INACTIVE)  | —               |
| `/admin/users/:id/role`   | PATCH | Змінити роль                              | SuperAdminGuard |

### Верифікація (`/admin/verifications`)

| Ендпоїнт                                 | Метод | Опис                               |
| ---------------------------------------- | ----- | ---------------------------------- |
| `/admin/verifications/volunteers`        | GET   | Неверифіковані волонтери           |
| `/admin/verifications/organizations`     | GET   | Неверифіковані організації         |
| `/admin/verifications/volunteers/:id`    | PATCH | Верифікувати/відхилити волонтера   |
| `/admin/verifications/organizations/:id` | PATCH | Верифікувати/відхилити організацію |

### Новини (`/admin/news`)

| Ендпоїнт              | Метод  | Опис                   |
| --------------------- | ------ | ---------------------- |
| `/admin/news`         | GET    | Всі новини (з пошуком) |
| `/admin/news/:id/pin` | PATCH  | Закріпити/відкріпити   |
| `/admin/news/:id`     | DELETE | Видалити               |

### Проєкти (`/admin/projects`)

| Ендпоїнт                     | Метод  | Опис                          |
| ---------------------------- | ------ | ----------------------------- |
| `/admin/projects`            | GET    | Список (фільтр status, пошук) |
| `/admin/projects/:id/status` | PATCH  | Змінити статус                |
| `/admin/projects/:id`        | DELETE | Видалити                      |

### Збори коштів (`/admin/campaigns`)

| Ендпоїнт                      | Метод  | Опис                          |
| ----------------------------- | ------ | ----------------------------- |
| `/admin/campaigns`            | GET    | Список (фільтр status, пошук) |
| `/admin/campaigns/:id/status` | PATCH  | Змінити статус                |
| `/admin/campaigns/:id`        | DELETE | Видалити                      |

### Попередження (`/admin/warnings`)

| Ендпоїнт                      | Метод | Опис                                      |
| ----------------------------- | ----- | ----------------------------------------- |
| `/admin/warnings`             | GET   | Список (фільтр user_id, status, severity) |
| `/admin/warnings/:id`         | GET   | Деталі                                    |
| `/admin/warnings`             | POST  | Видати попередження                       |
| `/admin/warnings/:id/resolve` | PATCH | Зняти попередження                        |
| `/admin/warnings/:id/cancel`  | PATCH | Скасувати                                 |

### Тікети (`/admin/tickets`)

| Ендпоїнт                    | Метод | Опис                             |
| --------------------------- | ----- | -------------------------------- |
| `/admin/tickets`            | GET   | Список (фільтр status, priority) |
| `/admin/tickets/:id/status` | PATCH | Змінити статус                   |

### Дашборд (`/admin/dashboard`)

| Ендпоїнт                           | Метод | Опис               |
| ---------------------------------- | ----- | ------------------ |
| `/admin/dashboard/stats`           | GET   | Статистика системи |
| `/admin/dashboard/recent-activity` | GET   | Остання активність |

### Нагороди (`/admin/rewards`)

| Ендпоїнт             | Метод  | Опис     |
| -------------------- | ------ | -------- |
| `/admin/rewards`     | GET    | Список   |
| `/admin/rewards/:id` | GET    | Деталі   |
| `/admin/rewards`     | POST   | Створити |
| `/admin/rewards/:id` | PATCH  | Оновити  |
| `/admin/rewards/:id` | DELETE | Видалити |

### Задачі (`/admin/tasks`)

| Ендпоїнт           | Метод  | Опис     |
| ------------------ | ------ | -------- |
| `/admin/tasks`     | GET    | Список   |
| `/admin/tasks/:id` | GET    | Деталі   |
| `/admin/tasks`     | POST   | Створити |
| `/admin/tasks/:id` | PATCH  | Оновити  |
| `/admin/tasks/:id` | DELETE | Видалити |

### Локації (`/admin/locations`)

| Ендпоїнт               | Метод  | Опис     |
| ---------------------- | ------ | -------- |
| `/admin/locations`     | GET    | Список   |
| `/admin/locations/:id` | GET    | Деталі   |
| `/admin/locations`     | POST   | Створити |
| `/admin/locations/:id` | PATCH  | Оновити  |
| `/admin/locations/:id` | DELETE | Видалити |

### Категорії (`/admin/categories`)

| Ендпоїнт                | Метод  | Опис     |
| ----------------------- | ------ | -------- |
| `/admin/categories`     | POST   | Створити |
| `/admin/categories/:id` | PUT    | Оновити  |
| `/admin/categories/:id` | DELETE | Видалити |

---

## Approval Request (черга заявок)

Модель `approval_request` для модерації контенту:

| Поле             | Тип                            | Опис                                                       |
| ---------------- | ------------------------------ | ---------------------------------------------------------- |
| id               | Int                            | PK                                                         |
| type             | `approval_request_type_enum`   | ORGANIZATION, VOLUNTEER, OTHER, NEWS, PROJECT, FUNDRAISING |
| status           | `approval_request_status_enum` | PENDING, APPROVED, REJECTED                                |
| entity_id        | Int                            | ID сутності яка на розгляді                                |
| submitted_by     | Int                            | FK -> app_user (хто подав)                                 |
| reviewed_by      | Int?                           | FK -> app_user (хто розглянув)                             |
| rejection_reason | String?                        | Причина відмови                                            |
| created_at       | DateTime                       | Дата подання                                               |
| reviewed_at      | DateTime?                      | Дата розгляду                                              |

---

## Organization Membership Request (заявки та запрошення до організації)

Модель `organization_membership_request` — уніфікована таблиця і для заявок волонтера, і для запрошень організації. Розрізняються через поле `direction`.

| Поле            | Тип                                              | Опис                                                  |
| --------------- | ------------------------------------------------ | ----------------------------------------------------- |
| id              | Int                                              | PK                                                    |
| organization_id | Int                                              | FK -> organization_profile                            |
| user_id         | Int                                              | FK -> app_user (волонтер)                             |
| direction       | `organization_membership_request_direction_enum` | `REQUEST` (волонтер → орг), `INVITE` (орг → волонтер) |
| status          | `organization_membership_request_status_enum`    | `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`        |
| created_at      | DateTime                                         | Дата створення                                        |
| reviewed_at     | DateTime?                                        | Дата прийняття/відхилення                             |

Унікальний індекс на `(organization_id, user_id)`: між однією парою юзер–організація одночасно існує максимум один запис (повторна заявка після REJECTED перезаписує наявний запис).

Саме членство зберігається у `app_user.organization_id`. На ACCEPTED це поле виставляється, на DELETE `/members/...` — скидається в `null`.

---

## Верифікація волонтера

Повний флоу:

1. Волонтер вантажить документ: `POST /upload/document` (PDF або фото) → отримує `{ url }`.
2. Записує URL у профіль: `PATCH /volunteer-profiles/:id` з body `{ "docs_url": url }`.
3. Подає заявку: `POST /volunteer-profiles/verification-request`. Створюється запис у `approval_request` з `type: VOLUNTEER`, `entity_id: volunteer_profile.id`, `status: PENDING`. Перевірки: профіль існує, `is_verified !== true`, `docs_url` не порожній, немає активної PENDING-заявки.
4. Адмін відкриває `GET /admin/approvals/:id` — у відповіді є `entity.docs_url`, який можна відкрити в браузері.
5. Адмін викликає `PATCH /admin/approvals/:id/approve` → у транзакції оновлює статус заявки на APPROVED і виставляє `volunteer_profile.is_verified = true`. Або `reject` з `reason` — `is_verified` залишається `false`, причина зберігається в `rejection_reason`.

Після REJECTED волонтер може подати заявку повторно (перевірка на активну PENDING пропустить, бо стара має статус REJECTED). Якщо `is_verified === true` — повторна подача забороняється (`Already verified`).

### Авто-matching

При створенні зустрічного запису pending-запрошення + заявка одразу конвертуються в членство:

- якщо волонтер подає заявку до організації, що його вже запросила (`INVITE` + `PENDING`) → запис стає `ACCEPTED`, `organization_id` заповнюється;
- якщо організація запрошує волонтера, який вже подав заявку (`REQUEST` + `PENDING`) → аналогічно.

---

## Захищені поля в DTO

Ці поля **не приймаються** від клієнта і встановлюються сервером:

| Сутність             | Поля що ігноруються                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| volunteer_profile    | `is_verified`, `rating`, `user_id` (з JWT). `docs_url` приймається через PATCH після завантаження в Cloudinary |
| organization_profile | `verification_status`, `user_id` (з JWT)                                                                       |
| app_user (update)    | тільки `email`, `first_name`, `last_name`, `city`                                                              |
| ticket               | `status`, `priority` (при створенні)                                                                           |
| fundraising_campaign | `current_amount`, `status`                                                                                     |
| news                 | `created_by`, `is_pinned`                                                                                      |
| task                 | `status` (при створенні)                                                                                       |
| task_assignment      | `volunteer_profile_id` (з JWT), `requester_confirmed`                                                          |

---

## Безпека

| Аспект            | Реалізація                                              |
| ----------------- | ------------------------------------------------------- |
| Автентифікація    | JWT Bearer Token (Passport)                             |
| Хешування паролів | Argon2                                                  |
| HTTP заголовки    | Helmet.js                                               |
| Валідація вводу   | Global ValidationPipe (whitelist, forbidNonWhitelisted) |
| CORS              | `http://localhost:4200`                                 |
| Глобальні Guard-и | JwtAuthGuard + RolesGuard                               |
| Ownership         | Перевірка user_id через JWT в сервісах                  |
| SuperAdmin        | SuperAdminGuard (admin_profile.is_super_admin)          |

---

## Ключові файли

| Призначення      | Шлях                                                           |
| ---------------- | -------------------------------------------------------------- |
| Схема БД         | `prisma/schema.prisma`                                         |
| Auth Service     | `backend/server/src/auth/auth.service.ts`                      |
| Auth Controller  | `backend/server/src/auth/auth.controller.ts`                   |
| JWT Strategy     | `backend/server/src/auth/strategies/jwt-access.strategy.ts`    |
| JWT Guard        | `backend/server/src/auth/guards/jwt-auth.guard.ts`             |
| Roles Guard      | `backend/server/src/auth/guards/roles.guard.ts`                |
| SuperAdmin Guard | `backend/server/src/admin/guards/super-admin.guard.ts`         |
| Admin Module     | `backend/server/src/admin/admin.module.ts`                     |
| @Public()        | `backend/server/src/auth/decorators/public.decorator.ts`       |
| @Roles()         | `backend/server/src/auth/decorators/roles.decorator.ts`        |
| @CurrentUser()   | `backend/server/src/auth/decorators/current-user.decorator.ts` |
| App Module       | `backend/server/src/app.module.ts`                             |
