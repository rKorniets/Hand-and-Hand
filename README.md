# Hand&Hand

# Проєкт Fullstack: Angular (Frontend) + NestJS (Backend).

# Структура проєкту
HandAndHand/
├─ backend/      ← NestJS (Node.js, TypeScript)
├─ frontend/     ← Angular (TypeScript)
├─ package.json  ← скрипти для одночасного запуску фронтенду та бекенду

# Встановлення
1. Клонуємо репозиторій:
  git clone https://github.com/rKorniets/Hand-and-Hand.git
  cd HandAndHand

2. Встановлюємо залежності:
  npm install
  cd frontend
  npm install
  cd ../backend
  npm install
  cd ..
  npm install --save-dev concurrently

4. Додаткові залежності
   Backend
   cd ../backend
   npm install @nestjs/jwt passport passport-jwt bcrypt prisma @prisma/client pg socket.io

   Frontend
   cd ../frontend
   npm install -g @angular/cli
   npm install jwt-decode socket.io-client

   Після установки Prisma: npx prisma init

# Скрипти
У package.json (корінь проєкту) вставити:

"scripts": {
    "start:backend": "cd backend/server && nest start --watch",
    "start:frontend": "cd frontend/app && ng serve -o",
    "start:dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
  },

  Запуск проєкту
  Dev-режим (одночасно Angular + NestJS)
    npm run start:dev

  Окремо
  Backend (NestJS)
    npm run start:backend

  Frontend (Angular)
    npm run start:frontend

# Налаштування CORS
Якщо Angular і NestJS на різних портах, у backend/src/main.ts додай:
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Дозволяє запити з Angular
    await app.listen(3000);
  }
  bootstrap();


# Залежності
Backend
  @nestjs/jwt, passport, passport-jwt, bcrypt
  prisma, @prisma/client
  pg (PostgreSQL драйвер)
  socket.io

Frontend
  jwt-decode
  socket.io-client
