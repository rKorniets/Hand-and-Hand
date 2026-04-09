import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationProfileDto } from '../../organization_profile/dto/create-organization-profile.dto';
import { verification_status_enum } from '@prisma/client';

@Injectable()
export class OrgProfileAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization_profile.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const profile = await this.prisma.organization_profile.findUnique({
      where: { id },
      include: {
        app_user: { select: { id: true, email: true, role: true, status: true } },
        location: true,
        project: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Профіль організації з ID ${id} не знайдено`);
    }

    return profile;
  }

  async create(data: CreateOrganizationProfileDto & { user_id: number }) {
    return this.prisma.organization_profile.create({
      data: {
        user_id: data.user_id,
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

  async update(id: number, data: CreateOrganizationProfileDto) {
    await this.findOne(id);

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

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.organization_profile.delete({ where: { id } });
  }
}
