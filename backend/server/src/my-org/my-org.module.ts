import { Module } from '@nestjs/common';
import { MyOrgController } from './my-org.controller';
import { MyOrgService } from './my-org.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MyOrgController],
  providers: [MyOrgService],
})
export class MyOrgModule {}
