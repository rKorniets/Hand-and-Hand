import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NewsModule } from './news/news.module';
import { ProjectModule } from './project/project.module';
import { AppUserModule } from './app_user/app-user.module';
import { VolunteerProfileModule } from './volunteer_profile/volunteer-profile.module';
import { OrganizationProfileModule } from './organization_profile/organization-profile.module';

@Module({
  imports: [
    PrismaModule,
    NewsModule,
    ProjectModule,
    AppUserModule,
    VolunteerProfileModule,
    OrganizationProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
