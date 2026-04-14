import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  user_status_enum,
  verification_status_enum,
  project_status_enum,
  fundraising_campaign_status_enum,
  ticket_status_enum,
  warning_status_enum,
  approval_request_status_enum,
} from '@prisma/client';

export interface DashboardStats {
  users: { total: number; active: number; pending: number; blocked: number };
  volunteers: { total: number; verified: number };
  organizations: { total: number; verified: number };
  pendingApprovals: number;
  activeProjects: number;
  activeCampaigns: number;
  openTickets: number;
  activeWarnings: number;
}

@Injectable()
export class DashboardAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<DashboardStats> {
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      blockedUsers,
      totalVolunteers,
      verifiedVolunteers,
      totalOrganizations,
      verifiedOrganizations,
      pendingApprovals,
      activeProjects,
      activeCampaigns,
      openTickets,
      activeWarnings,
    ] = await this.prisma.$transaction([
      this.prisma.app_user.count(),
      this.prisma.app_user.count({
        where: { status: user_status_enum.ACTIVE },
      }),
      this.prisma.app_user.count({
        where: { status: user_status_enum.PENDING },
      }),
      this.prisma.app_user.count({
        where: { status: user_status_enum.BLOCKED },
      }),
      this.prisma.volunteer_profile.count(),
      this.prisma.volunteer_profile.count({ where: { is_verified: true } }),
      this.prisma.organization_profile.count(),
      this.prisma.organization_profile.count({
        where: { verification_status: verification_status_enum.VERIFIED },
      }),
      this.prisma.approval_request.count({
        where: { status: approval_request_status_enum.PENDING },
      }),
      this.prisma.project.count({
        where: { status: project_status_enum.ACTIVE },
      }),
      this.prisma.fundraising_campaign.count({
        where: { status: fundraising_campaign_status_enum.ACTIVE },
      }),
      this.prisma.ticket.count({
        where: {
          status: {
            in: [ticket_status_enum.OPEN, ticket_status_enum.IN_REVIEW],
          },
        },
      }),
      this.prisma.warnings.count({
        where: { status: warning_status_enum.ACTIVE },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers,
        blocked: blockedUsers,
      },
      volunteers: { total: totalVolunteers, verified: verifiedVolunteers },
      organizations: {
        total: totalOrganizations,
        verified: verifiedOrganizations,
      },
      pendingApprovals,
      activeProjects,
      activeCampaigns,
      openTickets,
      activeWarnings,
    };
  }

  async getRecentActivity() {
    const [recentUsers, recentNews, recentProjects, recentApprovals] =
      await this.prisma.$transaction([
        this.prisma.app_user.findMany({
          take: 10,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            created_at: true,
          },
        }),
        this.prisma.news.findMany({
          take: 10,
          orderBy: { created_at: 'desc' },
          select: { id: true, title: true, created_at: true },
        }),
        this.prisma.project.findMany({
          take: 10,
          orderBy: { created_at: 'desc' },
          select: { id: true, title: true, status: true, created_at: true },
        }),
        this.prisma.approval_request.findMany({
          take: 10,
          orderBy: { created_at: 'desc' },
          include: {
            submitter: {
              select: { id: true, email: true },
            },
          },
        }),
      ]);

    return { recentUsers, recentNews, recentProjects, recentApprovals };
  }
}
