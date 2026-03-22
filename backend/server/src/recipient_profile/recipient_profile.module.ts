import { Module } from '@nestjs/common';
import { RecipientProfileService } from './recipient_profile.service';
import { RecipientProfileController } from './recipient_profile.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecipientProfileController],
  providers: [RecipientProfileService],
})
export class RecipientProfileModule {}
