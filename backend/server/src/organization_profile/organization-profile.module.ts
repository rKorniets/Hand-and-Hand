import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { OrganizationProfileController } from './organization-profile.controller';
import { OrganizationProfileService } from './organization-profile.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    CacheModule.register(),
    PrismaModule,
    CloudinaryModule,
    NotificationModule,
  ],
  controllers: [OrganizationProfileController],
  providers: [OrganizationProfileService],
})
export class OrganizationProfileModule {}
