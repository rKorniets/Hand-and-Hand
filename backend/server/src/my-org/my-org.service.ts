import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { project_status_enum, task_status_enum } from '@prisma/client';

@Injectable()
export class MyOrgService {
  constructor(private readonly prisma: PrismaService) {}
  private async getOrgProfile(userId: number) {
    const profile = await this.prisma.organization_profile.findFirst({
      where: { user_id: userId },
      select: { id: true },
    });
    if (!profile) {
      throw new NotFoundException('Профіль організації не знайдено');
    }
    return profile;
  }
  async getMyProjects(
    userId: number,
    status?: project_status_enum,
    limit = 10,
    skip = 0,
  ) {
    const profile = await this.getOrgProfile(userId);
    const where = {
      organization_profile_id: profile.id,
      ...(status && { status }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data, total };
  }
  async getMyTasks(userId: number, limit = 10, skip = 0) {
    const profile = await this.getOrgProfile(userId);
    const where = {
      project: {
        organization_profile_id: profile.id,
      },
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
        include: {
          project: { select: { id: true, title: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);
    return { data, total };
  }
  async getMyVolunteers(userId: number, limit = 10, skip = 0) {
    const profile = await this.getOrgProfile(userId);
    const where = {
      project: {
        organization_profile_id: profile.id,
      },
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.project_registration.findMany({
        where,
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
        include: {
          app_user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
          project: { select: { id: true, title: true } },
        },
      }),
      this.prisma.project_registration.count({ where }),
    ]);
    return { data, total };
  }
  async getMyCampaigns(userId: number, limit = 10, skip = 0) {
    const profile = await this.getOrgProfile(userId);
    const where = { organization_profile_id: profile.id };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.fundraising_campaign.findMany({
        where,
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.fundraising_campaign.count({ where }),
    ]);
    const safeData = data.map(({ mono_token, ...rest }) => rest);

    return { data: safeData, total };
  }
  async getMyStats(userId: number) {
    const profile = await this.getOrgProfile(userId);
    const orgFilter = { organization_profile_id: profile.id };
    const nestedOrgFilter = {
      project: { organization_profile_id: profile.id },
    };
    const [
      totalProjects,
      activeProjects,
      totalVolunteers,
      totalDonations,
      totalTasks,
      completedTasks,
    ] = await this.prisma.$transaction([
      this.prisma.project.count({ where: orgFilter }),
      this.prisma.project.count({
        where: { ...orgFilter, status: project_status_enum.ACTIVE },
      }),
      this.prisma.project_registration.count({ where: nestedOrgFilter }),
      this.prisma.donation.aggregate({
        where: {
          fundraising_campaign: { organization_profile_id: profile.id },
        },
        _sum: { amount: true },
      }),
      this.prisma.task.count({ where: nestedOrgFilter }),
      this.prisma.task.count({
        where: {
          ...nestedOrgFilter,
          status: task_status_enum.COMPLETED,
        },
      }),
    ]);
    return {
      totalProjects,
      activeProjects,
      totalVolunteers,
      totalDonations: totalDonations._sum.amount ?? 0,
      totalTasks,
      completedTasks,
    };
  }
}
