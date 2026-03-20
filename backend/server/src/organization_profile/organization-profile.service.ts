import { Injectable } from '@nestjs/common';
import { Prisma, verification_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';

@Injectable()
export class OrganizationProfileService {
  constructor(private prisma: PrismaService) {}

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

  async createOrganizationProfile(data: CreateOrganizationProfileDto) {
    return this.prisma.organization_profile.create({
      data: {
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        verification_status: data.verification_status ?? 'PENDING',
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
  ) {
    return this.prisma.organization_profile.update({
      where: { id },
      data: {
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        verification_status: data.verification_status,
        official_docs_url: data.official_docs_url,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        location_id: data.location_id,
      },
    });
  }
}
