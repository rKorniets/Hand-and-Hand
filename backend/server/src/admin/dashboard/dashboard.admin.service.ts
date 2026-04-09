import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
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
      this.prisma.app_user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.app_user.count({ where: { status: 'PENDING' } }),
      this.prisma.app_user.count({ where: { status: 'BLOCKED' } }),
      this.prisma.volunteer_profile.count(),
      this.prisma.volunteer_profile.count({ where: { is_verified: true } }),
      this.prisma.organization_profile.count(),
      this.prisma.organization_profile.count({ where: { verification_status: 'VERIFIED' } }),
      this.prisma.approval_request.count({ where: { status: 'PENDING' } }),
      this.prisma.project.count({ where: { status: 'ACTIVE' } }),
      this.prisma.fundraising_campaign.count({ where: { status: 'ACTIVE' } }),
      this.prisma.ticket.count({ where: { status: { in: ['OPEN', 'IN_REVIEW'] } } }),
      this.prisma.warnings.count({ where: { status: 'ACTIVE' } }),
    ]);

    return {
      users: { total: totalUsers, active: activeUsers, pending: pendingUsers, blocked: blockedUsers },
      volunteers: { total: totalVolunteers, verified: verifiedVolunteers },
      organizations: { total: totalOrganizations, verified: verifiedOrganizations },
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
          select: { id: true, email: true, role: true, status: true, created_at: true },
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
