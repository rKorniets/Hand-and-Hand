import { Module } from '@nestjs/common';
import { WarningService } from './warning.service';
import { WarningController } from './warning.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WarningController],
  providers: [WarningService],
})
export class WarningModule {}
