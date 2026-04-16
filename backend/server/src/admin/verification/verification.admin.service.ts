import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { verification_status_enum } from '@prisma/client';

@Injectable()
export class VerificationAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnverifiedVolunteers() {
    return this.prisma.volunteer_profile.findMany({
      where: { is_verified: false },
      include: {
        app_user: {
          select: { id: true, email: true, first_name: true, last_name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findUnverifiedOrganizations() {
    return this.prisma.organization_profile.findMany({
      where: { verification_status: verification_status_enum.PENDING },
      include: {
        app_user: {
          select: { id: true, email: true, first_name: true, last_name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async verifyVolunteer(profileId: number, verified: boolean) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException(`Volunteer profile with ID ${profileId} not found`);
    }

    return this.prisma.volunteer_profile.update({
      where: { id: profileId },
      data: { is_verified: verified },
    });
  }

  async verifyOrganization(profileId: number, status: verification_status_enum) {
    const profile = await this.prisma.organization_profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException(`Organization profile with ID ${profileId} not found`);
    }

    return this.prisma.organization_profile.update({
      where: { id: profileId },
      data: { verification_status: status },
    });
  }
}
