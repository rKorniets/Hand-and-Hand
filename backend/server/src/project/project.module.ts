import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    NotificationModule,
    CacheModule.register(),
    PrismaModule,
    CloudinaryModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
