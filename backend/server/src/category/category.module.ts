import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CacheModule.register(), PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
