import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationProfileDto } from '../../organization_profile/dto/create-organization-profile.dto';
import {
  verification_status_enum,
  approval_request_status_enum,
  user_status_enum,
} from '@prisma/client';

@Injectable()
export class OrgProfileAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization_profile.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findPending() {
    return this.prisma.approval_request.findMany({
      where: { type: 'ORGANIZATION', status: 'PENDING' },
      orderBy: { created_at: 'desc' },
      include: {
        submitter: {
          select: {
            id: true,
            email: true,
            status: true,
            organization_profile: {
              select: {
                id: true,
                name: true,
                edrpou: true,
                contact_email: true,
                created_at: true,
              },
            },
          },
        },
      },
    });
  }
  async approveOrganization(approvalRequestId: number, adminUserId: number) {
    const request = await this.prisma.approval_request.findUnique({
      where: { id: approvalRequestId },
      include: { submitter: { include: { organization_profile: true } } },
    });

    if (!request) throw new NotFoundException('Запит не знайдено');

    await this.prisma.$transaction(async (tx) => {
      await tx.approval_request.update({
        where: { id: approvalRequestId },
        data: {
          status: approval_request_status_enum.APPROVED,
          reviewed_by: adminUserId,
          reviewed_at: new Date(),
        },
      });

      await tx.app_user.update({
        where: { id: request.submitted_by },
        data: { status: user_status_enum.ACTIVE },
      });

      if (request.submitter.organization_profile) {
        await tx.organization_profile.update({
          where: { user_id: request.submitted_by },
          data: { verification_status: verification_status_enum.VERIFIED },
        });
      }
    });

    return { message: 'Організацію підтверджено' };
  }

  async rejectOrganization(approvalRequestId: number, adminUserId: number) {
    const request = await this.prisma.approval_request.findUnique({
      where: { id: approvalRequestId },
    });

    if (!request) throw new NotFoundException('Запит не знайдено');

    await this.prisma.$transaction(async (tx) => {
      await tx.approval_request.update({
        where: { id: approvalRequestId },
        data: {
          status: approval_request_status_enum.REJECTED,
          reviewed_by: adminUserId,
          reviewed_at: new Date(),
        },
      });

      await tx.app_user.update({
        where: { id: request.submitted_by },
        data: { status: user_status_enum.INACTIVE },
      });

      await tx.organization_profile.update({
        where: { user_id: request.submitted_by },
        data: { verification_status: verification_status_enum.REJECTED },
      });
    });

    return { message: 'Організацію відхилено' };
  }

  async findOne(id: number) {
    const profile = await this.prisma.organization_profile.findUnique({
      where: { id },
      include: {
        app_user: {
          select: { id: true, email: true, role: true, status: true },
        },
        location: true,
        project: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Organization profile with ID ${id} not found`,
      );
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
