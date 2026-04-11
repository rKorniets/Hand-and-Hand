import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { NewsModule } from './news/news.module';
import { ProjectModule } from './project/project.module';
import { AppUserModule } from './app_user/app-user.module';
import { VolunteerProfileModule } from './volunteer_profile/volunteer-profile.module';
import { OrganizationProfileModule } from './organization_profile/organization-profile.module';
import { FundraisingCampaignModule } from './fundraising_campaign/fundraising_campaign.module';
import { ReportModule } from './report/report.module';
import { TicketModule } from './ticket/ticket.module';
import { WarningModule } from './warning/warning.module';
import { TaskModule } from './task/task.module';
import { LocationModule } from './location/location.module';
import { CategoryModule } from './category/category.module';
import { RewardModule } from './reward/reward.module';
import { TaskAssignmentModule } from './task_assignment/task_assignment.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    AuthModule,
    NewsModule,
    ProjectModule,
    AppUserModule,
    VolunteerProfileModule,
    OrganizationProfileModule,
    FundraisingCampaignModule,
    ReportModule,
    TicketModule,
    WarningModule,
    TaskModule,
    LocationModule,
    CategoryModule,
    RewardModule,
    TaskAssignmentModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
