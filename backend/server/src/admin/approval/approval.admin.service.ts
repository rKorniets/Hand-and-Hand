import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApprovalQueryDto } from './dto/approval-query.dto';
import {
  Prisma,
  approval_request_status_enum,
  approval_request_type_enum,
  project_status_enum,
  verification_status_enum,
} from '@prisma/client';

@Injectable()
export class ApprovalAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ApprovalQueryDto) {
    const where: Prisma.approval_requestWhereInput = {
      ...(query.type && { type: query.type }),
      ...(query.status && { status: query.status }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.approval_request.findMany({
        where,
        take: query.limit,
        skip: query.skip,
        orderBy: { created_at: 'desc' },
        include: {
          submitter: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              role: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      this.prisma.approval_request.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const request = await this.prisma.approval_request.findUnique({
      where: { id },
      include: {
        submitter: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            role: true,
          },
        },
        reviewer: {
          select: { id: true, email: true, first_name: true, last_name: true },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Approval request with ID ${id} not found`);
    }

    return request;
  }

  async approve(id: number, adminUserId: number) {
    const request = await this.findOne(id);

    await this.prisma.$transaction(async (tx) => {
      await tx.approval_request.update({
        where: { id },
        data: {
          status: approval_request_status_enum.APPROVED,
          reviewed_by: adminUserId,
          reviewed_at: new Date(),
        },
      });

      if (request.type === approval_request_type_enum.PROJECT) {
        await tx.project.update({
          where: { id: request.entity_id },
          data: { status: project_status_enum.ACTIVE },
        });
      }

      if (request.type === approval_request_type_enum.ORGANIZATION) {
        await tx.organization_profile.update({
          where: { id: request.entity_id },
          data: { verification_status: verification_status_enum.VERIFIED },
        });
      }
    });
  }

  async reject(id: number, adminUserId: number, reason: string) {
    const request = await this.findOne(id);

    await this.prisma.$transaction(async (tx) => {
      await tx.approval_request.update({
        where: { id },
        data: {
          status: approval_request_status_enum.REJECTED,
          reviewed_by: adminUserId,
          reviewed_at: new Date(),
          rejection_reason: reason,
        },
      });

      if (request.type === approval_request_type_enum.PROJECT) {
        await tx.project.update({
          where: { id: request.entity_id },
          data: { status: project_status_enum.ARCHIVED },
        });
      }

      if (request.type === approval_request_type_enum.ORGANIZATION) {
        await tx.organization_profile.update({
          where: { id: request.entity_id },
          data: { verification_status: verification_status_enum.REJECTED },
        });
      }
    });
  }
}
