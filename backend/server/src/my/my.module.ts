import { Module } from '@nestjs/common';
import { MyController } from './my.controller';
import { MyService } from './my.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MyController],
  providers: [MyService],
})
export class MyModule {}
