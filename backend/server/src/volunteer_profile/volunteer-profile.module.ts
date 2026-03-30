import { Module } from '@nestjs/common';
import { VolunteerProfileController } from './volunteer-profile.controller';
import { VolunteerProfileService } from './volunteer-profile.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VolunteerProfileController],
  providers: [VolunteerProfileService],
})
export class VolunteerProfileModule {}
