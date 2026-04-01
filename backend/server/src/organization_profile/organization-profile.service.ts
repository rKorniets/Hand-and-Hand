import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  verification_status_enum,
  user_role_enum,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';

export interface RequestUser {
  id: number;
  role: user_role_enum;
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
      throw new NotFoundException(`Профіль організації з ID ${id} не знайдено`);
    }

    if (
      currentUser.role !== user_role_enum.ADMIN &&
      profile.user_id !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Ви не маєте прав редагувати або видаляти чужий профіль',
      );
    }

    return profile;
  }

  async getOrganizationProfiles(
    limit: number,
    skip: number,
    verificationStatus?: verification_status_enum,
  ) {
    const whereClause: Prisma.organization_profileWhereInput =
      verificationStatus ? { verification_status: verificationStatus } : {};

    return this.prisma.organization_profile.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrganizationProfileById(id: number) {
    return this.prisma.organization_profile.findUnique({ where: { id } });
  }

  async createOrganizationProfile(
    data: CreateOrganizationProfileDto,
    currentUser: RequestUser,
  ) {
    if (
      currentUser.role !== user_role_enum.ADMIN &&
      data.user_id !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Ви не можете створити профіль для іншого користувача',
      );
    }

    const initialStatus =
      currentUser.role === user_role_enum.ADMIN && data.verification_status
        ? data.verification_status
        : verification_status_enum.PENDING;

    return this.prisma.organization_profile.create({
      data: {
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        verification_status: initialStatus,
        official_docs_url: data.official_docs_url,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        location_id: data.location_id,
      },
    });
  }

  async updateOrganizationProfileFull(
    id: number,
    data: CreateOrganizationProfileDto,
    currentUser: RequestUser,
  ) {
    const profile = await this.validateOrganizationOwnership(id, currentUser);

    const updatedStatus =
      currentUser.role === user_role_enum.ADMIN &&
      data.verification_status !== undefined
        ? data.verification_status
        : profile.verification_status;

    return this.prisma.organization_profile.update({
      where: { id },
      data: {
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        verification_status: updatedStatus,
        official_docs_url: data.official_docs_url,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        location_id: data.location_id,
      },
    });
  }

  async deleteOrganizationProfile(id: number, currentUser: RequestUser) {
    await this.validateOrganizationOwnership(id, currentUser);
    return this.prisma.organization_profile.delete({ where: { id } });
  }
}
