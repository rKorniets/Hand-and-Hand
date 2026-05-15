import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsAdminService } from '../admin/news/news.admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    CacheModule.register(),
    PrismaModule,
    CloudinaryModule,
    WebsocketModule,
  ],
  controllers: [NewsController],
  providers: [NewsService, NewsAdminService],
})
export class NewsModule {}
