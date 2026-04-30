import { Module } from '@nestjs/common';
import { AppUserController } from './app-user.controller';
import { AppUserService } from './app-user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, NotificationModule],
  controllers: [AppUserController],
  providers: [AppUserService],
  exports: [AppUserService],
})
export class AppUserModule {}
