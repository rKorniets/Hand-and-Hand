import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CacheModule.register(), PrismaModule, CloudinaryModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
