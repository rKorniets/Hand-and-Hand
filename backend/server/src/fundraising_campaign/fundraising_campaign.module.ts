import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FundraisingCampaignController } from './fundraising_campaign.controller';
import { FundraisingCampaignService } from './fundraising_campaign.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MonoPollingService } from './mono_polling.service';
import { MonobankService } from './monobank.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
@Module({
  imports: [PrismaModule, ConfigModule, CloudinaryModule],
  controllers: [FundraisingCampaignController],
  providers: [FundraisingCampaignService, MonoPollingService, MonobankService],
  exports: [MonobankService],
})
export class FundraisingCampaignModule {}
