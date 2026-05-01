import { Module } from '@nestjs/common';
import { AppUserController } from './app-user.controller';
import { AppUserService } from './app-user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [AppUserController],
  providers: [AppUserService],
  exports: [AppUserService],
})
export class AppUserModule {}
