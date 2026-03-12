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
  
