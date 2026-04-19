import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, verification_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class OrganizationProfileService {
  constructor(private prisma: PrismaService) {}

  private async validateOrganizationOwnership(
    id: number,
    currentUser: RequestUser,
  ) {
    const profile = await this.prisma.organization_profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(
        `Organization profile with ID ${id} not found`,
      );
    }

    if (profile.user_id !== currentUser.id) {
      throw new ForbiddenException(
        "You do not have permission to edit or delete another user's profile",
      );
    }

    return profile;
  }

  async getOrganizationProfiles(
    limit?: number,
    skip?: number,
    verificationStatus?: verification_status_enum,
    search?: string,
  ) {
    const whereClause: Prisma.organization_profileWhereInput = {
      ...(verificationStatus && {
        verification_status: verificationStatus,
      }),
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.organization_profile.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.organization_profile.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async getOrganizationProfileById(id: number) {
    return this.prisma.organization_profile.findUnique({ where: { id } });
  }

  async createOrganizationProfile(
    data: CreateOrganizationProfileDto,
    currentUser: RequestUser,
  ) {
    return this.prisma.organization_profile.create({
      data: {
        user_id: currentUser.id,
        name: data.name,
        edrpou: data.edrpou,
        description: data.description,
        verification_status: verification_status_enum.PENDING,
        official_docs_url: data.official_docs_url,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        location_id: data.location_id,
        mission: data.mission,
      },
    });
  }

  async updateOrganizationProfileFull(
    id: number,
    data: CreateOrganizationProfileDto,
    currentUser: RequestUser,
  ) {
    await this.validateOrganizationOwnership(id, currentUser);

    return this.prisma.organization_profile.update({
      where: { id },
      data: {
        name: data.name,
        edrpou: data.edrpou,
        description: data.description,
        official_docs_url: data.official_docs_url,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        location_id: data.location_id,
        mission: data.mission,
      },
    });
  }

  async deleteOrganizationProfile(id: number, currentUser: RequestUser) {
    await this.validateOrganizationOwnership(id, currentUser);
    return this.prisma.organization_profile.delete({ where: { id } });
  }

  async getOrganizationProjects(orgId: number) {
    return this.prisma.project.findMany({
      where: { organization_profile_id: orgId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrganizationReports(orgId: number) {
    return this.prisma.report.findMany({
      where: { organization_profile_id: orgId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrganizationMembers(orgId: number) {
    return this.prisma.organization_profile.findUnique({
      where: { id: orgId },
      include: {
        members: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            city: true,
          },
        },
      },
    });
  }

  async getOrganizationFundraising(orgId: number) {
    return this.prisma.fundraising_campaign.findMany({
      where: { organization_profile_id: orgId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrganizationProfileByUserId(userId: number) {
    return this.prisma.organization_profile.findUnique({
      where: { user_id: userId },
    });
  }
}
