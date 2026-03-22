import { Module } from '@nestjs/common';
import { FundraisingCampaignController } from './fundraising_campaign.controller';
import { FundraisingCampaignService } from './fundraising_campaign.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [FundraisingCampaignController],
  providers: [FundraisingCampaignService],
})
export class FundraisingCampaignModule {}
