import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CacheModule.register(), PrismaModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
