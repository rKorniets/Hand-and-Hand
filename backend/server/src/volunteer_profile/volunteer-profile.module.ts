import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { VolunteerProfileController } from './volunteer-profile.controller';
import { VolunteerProfileService } from './volunteer-profile.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CacheModule.register(), PrismaModule],
  controllers: [VolunteerProfileController],
  providers: [VolunteerProfileService],
})
export class VolunteerProfileModule {}
