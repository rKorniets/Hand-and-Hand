import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsAdminService } from '../admin/news/news.admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CacheModule.register(), PrismaModule, CloudinaryModule],
  controllers: [NewsController],
  providers: [NewsService, NewsAdminService],
})
export class NewsModule {}
