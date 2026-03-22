import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NewsModule } from './news/news.module';
import { ProjectModule } from './project/project.module';
import { FundraisingCampaignModule } from './fundraising_campaign/fundraising_campaign.module';
import { RecipientProfileModule } from './recipient_profile/recipient_profile.module';

@Module({
  imports: [PrismaModule, NewsModule, ProjectModule, FundraisingCampaignModule, RecipientProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
