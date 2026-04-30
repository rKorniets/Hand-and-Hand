import { Module } from '@nestjs/common';
import { OrganizationProfileController } from './organization-profile.controller';
import { OrganizationProfileService } from './organization-profile.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [OrganizationProfileController],
  providers: [OrganizationProfileService],
})
export class OrganizationProfileModule {}
