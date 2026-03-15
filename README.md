# Hand&Hand

## Проєкт Fullstack: Angular (Frontend) + NestJS (Backend).

# Структура проєкту
HandAndHand<br>
├─ backend/      ← NestJS (Node.js, TypeScript)<br>
├─ frontend/     ← Angular (TypeScript)<br>

# Встановлення
1. Клонуємо репозиторій:<br>
  git clone https://github.com/rKorniets/Hand-and-Hand.git<br>
  cd HandAndHand<br>

2. Встановлюємо залежності:
  npm install<br>
  cd frontend/app<br>
  npm install<br>
  cd ../../backend/server<br>
  npm install<br>
  cd ../..<br>
  npm install --save-dev concurrently<br>

4. Додаткові залежності
   Backend<br>
   cd backend/server<br>
   npm install @nestjs/jwt passport passport-jwt bcrypt<br>
   npm install prisma @prisma/client pg<br>
   npm install socket.io<br>

   Frontend<br>
   cd ../../frontend/app<br>
   npm install -g @angular/cli<br>
   npm install jwt-decode socket.io-client<br>

   Після установки Prisma: npx prisma init<br>

# Скрипти
У package.json (корінь проєкту) вставити:<br>

    "scripts": {
        "start:backend": "cd backend/server && nest start --watch",
        "start:frontend": "cd frontend/app && ng serve -o",
        "start:dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
      },

Запуск проєкту:<br>
  Dev-режим (одночасно Angular + NestJS):<br>
	  npm run start:dev<br>

  Окремо:<br>
  Backend (NestJS):<br>
	   npm run start:backend<br>

  Frontend (Angular):<br>
    npm run start:frontend<br>

# Налаштування CORS
Якщо Angular і NestJS на різних портах, у backend/src/main.ts додай:<br>
 

     import { NestFactory } from '@nestjs/core';
      import { AppModule } from './app.module';
      
      async function bootstrap() {
        const app = await NestFactory.create(AppModule);
        app.enableCors(); // Дозволяє запити з Angular
        await app.listen(4200);
      }
      bootstrap();


# Залежності
Backend:<br>
  @nestjs/jwt, passport, passport-jwt, bcrypt<br>
  prisma, @prisma/client<br>
  pg (PostgreSQL драйвер)<br>
  socket.io<br>

Frontend: <br>
  jwt-decode <br>
  socket.io-client <br>

# Naming Conventions

## 1. Загальні принципи

- Назви мають бути зрозумілими <br>
- Один тип сутностей = один стиль іменування <br>
- Не змішуємо різні стилі без причини <br>
- Якщо є сумнів — обираємо той формат, який уже використовується в цьому документі <br>

---<br>

## 2. Files — `kebab-case`

Усі назви файлів мають використовувати `kebab-case`.<br>

### Приклади:
- `user-service.ts`<br>
- `auth-controller.ts`<br>

### Не можна:
- `UserService.ts`<br>
- `user_service.ts`<br>
- `userService.ts`<br>

## 3. Styles — подвійне підкреслення `__`

### Формат:
- `block`<br>
- `block__element`<br>
- `block__element--modifier`<br>

### Приклади:
- `card`<br>
- `card__title`<br>

### Не можна:
- `card_title`<br>
- `CardTitle`<br>

## 4. Variables and Methods — `camelCase`

Для змінних і методів використовуємо `camelCase`.<br>

### Змінні:
- `userName`<br>
- `taskCount`<br>

### Методи:
- `getUserById()`<br>

### Не можна:
- `UserName`<br>
- `user_name`<br>
- `GET_USER_BY_ID`<br>

## 5. Classes, Types, Interfaces, Enums, DTO — `PascalCase`

Для класів, типів, інтерфейсів, enum-ів використовуємо `PascalCase`.

### Classes:
- `UserService`<br>
- `AuthController`<br>
- `VolunteerProfile`<br>
### Types:
- `UserRole`<br>

### Interfaces:
- `UserPayload`<br>

### Enums:
- `TaskAssignmentStatus`<br>


### Не можна:
- `userService`<br>
- `create_user_dto`<br>
- `task_status`<br>

## 6. SQL — `snake_case`

Для SQL-імен використовуємо `snake_case`.<br>

### 6.1. Tables — `snake_case`

Назви таблиць мають бути в `snake_case`.<br>

### Приклади:
- `users`<br>
- `volunteer_profiles`<br>

### Не можна:
- `Users`<br>
- `volunteerProfiles`<br>
- `volunteer-profiles`<br>

### 6.2. Columns — `snake_case`

Назви колонок теж мають бути в `snake_case`.

### Приклади:
- `user_id`<br>
- `display_name`<br>


### Не можна:
- `userId`<br>
- `DisplayName`<br>
- `createdAt`<br>



## 7. Constants,environment variables — `UPPER_SNAKE_CASE`

Для констант та env keys використовуємо `UPPER_SNAKE_CASE`.<br>

### Приклади:
- `MAX_RETRY_COUNT`<br>
- `DEFAULT_PAGE_SIZE`<br>
- `DATABASE_URL`<br>

### Не можна:
- `maxRetryCount`<br>
- `MaxRetryCount`<br>
- `max_retry_count`<br>
- `databaseUrl`<br>
- `jwtSecret`<br>
- `node-env`<br>
