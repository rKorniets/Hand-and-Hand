import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, verification_status_enum } from '@prisma/client';

@Injectable()
export class VerificationAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnverifiedVolunteers(
    limit?: number,
    skip?: number,
    search?: string,
  ) {
    const whereClause: Prisma.volunteer_profileWhereInput = {
      is_verified: false,
      ...(search && {
        OR: [
          { display_name: { contains: search, mode: 'insensitive' } },
          { app_user: { email: { contains: search, mode: 'insensitive' } } },
          {
            app_user: { first_name: { contains: search, mode: 'insensitive' } },
          },
          {
            app_user: { last_name: { contains: search, mode: 'insensitive' } },
          },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.volunteer_profile.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        include: {
          app_user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.volunteer_profile.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findUnverifiedOrganizations(
    limit?: number,
    skip?: number,
    search?: string,
  ) {
    const whereClause: Prisma.organization_profileWhereInput = {
      verification_status: verification_status_enum.PENDING,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { edrpou: { contains: search, mode: 'insensitive' } },
          { app_user: { email: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.organization_profile.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        include: {
          app_user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.organization_profile.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async verifyVolunteer(profileId: number, verified: boolean) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException(
        `Volunteer profile with ID ${profileId} not found`,
      );
    }

    return this.prisma.volunteer_profile.update({
      where: { id: profileId },
      data: { is_verified: verified },
    });
  }

  async verifyOrganization(
    profileId: number,
    status: verification_status_enum,
  ) {
    const profile = await this.prisma.organization_profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException(
        `Organization profile with ID ${profileId} not found`,
      );
    }

    return this.prisma.organization_profile.update({
      where: { id: profileId },
      data: { verification_status: status },
    });
  }
}
