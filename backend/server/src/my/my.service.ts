import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { task_assignment_status_enum } from '@prisma/client';

@Injectable()
export class MyService {
  constructor(private readonly prisma: PrismaService) {}

  private async getVolunteerProfile(userId: number) {
    const profile = await this.prisma.volunteer_profile.findFirst({
      where: { user_id: userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Профіль волонтера не знайдено');
    }

    return profile;
  }

  async getMyTasks(
    userId: number,
    status?: task_assignment_status_enum,
    limit = 10,
    skip = 0,
  ) {
    const profile = await this.getVolunteerProfile(userId);

    const where = {
      volunteer_profile_id: profile.id,
      ...(status
        ? { status }
        : {
            status: {
              in: [
                task_assignment_status_enum.ASSIGNED,
                task_assignment_status_enum.ACCEPTED,
                task_assignment_status_enum.COMPLETED,
              ],
            },
          }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task_assignment.findMany({
        where,
        take: limit,
        skip,
        include: { task: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.task_assignment.count({ where }),
    ]);

    return { data, total };
  }

  async getMyProjects(userId: number, limit = 10, skip = 0) {
    const where = { user_id: userId };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project_registration.findMany({
        where,
        take: limit,
        skip,
        include: { project: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.project_registration.count({ where }),
    ]);

    return { data, total };
  }
  async getMyDonations(userId: number, limit = 10, skip = 0) {
    const where = { user_id: userId };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.donation.findMany({
        where,
        take: limit,
        skip,
        include: {
          fundraising_campaign: {
            select: { id: true, title: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.donation.count({ where }),
    ]);

    return { data, total };
  }
  async getMyStats(userId: number) {
    const profile = await this.getVolunteerProfile(userId);

    const [completedTasks, activeTasks, registeredProjects, volProfile] =
      await this.prisma.$transaction([
        this.prisma.task_assignment.count({
          where: {
            volunteer_profile_id: profile.id,
            status: task_assignment_status_enum.COMPLETED,
          },
        }),
        this.prisma.task_assignment.count({
          where: {
            volunteer_profile_id: profile.id,
            status: {
              in: [
                task_assignment_status_enum.ASSIGNED,
                task_assignment_status_enum.ACCEPTED,
              ],
            },
          },
        }),
        this.prisma.project_registration.count({
          where: { user_id: userId },
        }),
        this.prisma.volunteer_profile.findFirst({
          where: { id: profile.id },
          select: { rating: true, app_user: { select: { points: true } } },
        }),
      ]);

    return {
      totalPoints: volProfile?.app_user.points ?? 0,
      completedTasks,
      activeTasks,
      registeredProjects,
      rating: volProfile?.rating ?? null,
    };
  }
}
