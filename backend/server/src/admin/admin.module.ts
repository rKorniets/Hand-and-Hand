import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RewardModule } from '../reward/reward.module';
import { LocationModule } from '../location/location.module';

import { ApprovalAdminController } from './approval/approval.admin.controller';
import { ApprovalAdminService } from './approval/approval.admin.service';

import { UserAdminController } from './user/user.admin.controller';
import { UserAdminService } from './user/user.admin.service';

import { VerificationAdminController } from './verification/verification.admin.controller';
import { VerificationAdminService } from './verification/verification.admin.service';

import { NewsAdminController } from './news/news.admin.controller';
import { NewsAdminService } from './news/news.admin.service';

import { ProjectAdminController } from './project/project.admin.controller';
import { ProjectAdminService } from './project/project.admin.service';

import { CampaignAdminController } from './campaign/campaign.admin.controller';
import { CampaignAdminService } from './campaign/campaign.admin.service';

import { WarningAdminController } from './warning/warning.admin.controller';
import { WarningAdminService } from './warning/warning.admin.service';

import { TicketAdminController } from './ticket/ticket.admin.controller';
import { TicketAdminService } from './ticket/ticket.admin.service';

import { DashboardAdminController } from './dashboard/dashboard.admin.controller';
import { DashboardAdminService } from './dashboard/dashboard.admin.service';

import { RewardAdminController } from './reward/reward.admin.controller';
import { TaskAdminController } from './task/task.admin.controller';
import { TaskAdminService } from './task/task.admin.service';
import { LocationAdminController } from './location/location.admin.controller';
import { CategoryAdminController } from './category/category.admin.controller';
import { CategoryAdminService } from './category/category.admin.service';

import { OrgProfileAdminController } from './org-profile/org-profile.admin.controller';
import { OrgProfileAdminService } from './org-profile/org-profile.admin.service';

import { ReportAdminController } from './report/report.admin.controller';
import { ReportAdminService } from './report/report.admin.service';

import { TaskAssignmentAdminController } from './task-assignment/task-assignment.admin.controller';
import { TaskAssignmentAdminService } from './task-assignment/task-assignment.admin.service';

import { VolunteerProfileAdminController } from './volunteer-profile/volunteer-profile.admin.controller';
import { VolunteerProfileAdminService } from './volunteer-profile/volunteer-profile.admin.service';

import { SuperAdminGuard } from './guards/super-admin.guard';

import { FundraisingCampaignModule } from '../fundraising_campaign/fundraising_campaign.module';
import { PointsModule } from '../points/points.module';

import { PointsAdminController } from './points/points.admin.controller';
import { PointsAdminService } from './points/points.admin.service';

@Module({
  imports: [
    PrismaModule,
    RewardModule,
    LocationModule,
    FundraisingCampaignModule,
    PointsModule,
  ],
  controllers: [
    ApprovalAdminController,
    UserAdminController,
    VerificationAdminController,
    NewsAdminController,
    ProjectAdminController,
    CampaignAdminController,
    WarningAdminController,
    TicketAdminController,
    DashboardAdminController,
    RewardAdminController,
    TaskAdminController,
    LocationAdminController,
    CategoryAdminController,
    OrgProfileAdminController,
    ReportAdminController,
    TaskAssignmentAdminController,
    VolunteerProfileAdminController,
    PointsAdminController,
  ],
  providers: [
    ApprovalAdminService,
    UserAdminService,
    VerificationAdminService,
    NewsAdminService,
    ProjectAdminService,
    CampaignAdminService,
    WarningAdminService,
    TicketAdminService,
    DashboardAdminService,
    TaskAdminService,
    CategoryAdminService,
    OrgProfileAdminService,
    ReportAdminService,
    TaskAssignmentAdminService,
    VolunteerProfileAdminService,
    SuperAdminGuard,
    PointsAdminService,
  ],
})
export class AdminModule {}
