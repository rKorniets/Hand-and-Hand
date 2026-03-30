import { Module } from '@nestjs/common';
import { OrganizationProfileController } from './organization-profile.controller';
import { OrganizationProfileService } from './organization-profile.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrganizationProfileController],
  providers: [OrganizationProfileService],
})
export class OrganizationProfileModule {}
