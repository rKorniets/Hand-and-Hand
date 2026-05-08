import { Module } from '@nestjs/common';
import { NotificationOrganizationController } from './notification-organization.controller';
import { NotificationOrganizationService } from './notification-organization.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationOrganizationController],
  providers: [NotificationOrganizationService],
  exports: [NotificationOrganizationService],
})
export class NotificationOrganizationModule {}
