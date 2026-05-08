import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CacheModule.register(), PrismaModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
