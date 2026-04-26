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

  async findAll(
    params: ApprovalQueryDto & {
      limit?: number;
      skip?: number;
      search?: string;
    },
  ) {
    const whereClause: Prisma.approval_requestWhereInput = {
      ...(params.type && { type: params.type }),
      ...(params.status && { status: params.status }),
      ...(params.search && {
        rejection_reason: { contains: params.search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.approval_request.findMany({
        where: whereClause,
        take: params.limit,
        skip: params.skip,
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
      this.prisma.approval_request.count({ where: whereClause }),
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

    const entity = await this.loadEntity(request.type, request.entity_id);

    return { ...request, entity };
  }

  private async loadEntity(type: approval_request_type_enum, entityId: number) {
    if (type === approval_request_type_enum.VOLUNTEER) {
      return this.prisma.volunteer_profile.findUnique({
        where: { id: entityId },
      });
    }
    if (type === approval_request_type_enum.ORGANIZATION) {
      return this.prisma.organization_profile.findUnique({
        where: { id: entityId },
      });
    }
    if (type === approval_request_type_enum.PROJECT) {
      return this.prisma.project.findUnique({ where: { id: entityId } });
    }
    return null;
  }

  async approve(id: number, adminUserId: number) {
    return this.handleResolution(
      id,
      adminUserId,
      approval_request_status_enum.APPROVED,
    );
  }

  async reject(id: number, adminUserId: number, reason: string) {
    return this.handleResolution(
      id,
      adminUserId,
      approval_request_status_enum.REJECTED,
      reason,
    );
  }

  private async handleResolution(
    id: number,
    adminUserId: number,
    status: approval_request_status_enum,
    reason?: string,
  ) {
    const request = await this.findOne(id);
    const isApprove = status === approval_request_status_enum.APPROVED;

    await this.prisma.$transaction(async (tx) => {
      await tx.approval_request.update({
        where: { id },
        data: {
          status,
          reviewed_by: adminUserId,
          reviewed_at: new Date(),
          rejection_reason: reason,
        },
      });

      if (request.type === approval_request_type_enum.PROJECT) {
        await tx.project.update({
          where: { id: request.entity_id },
          data: {
            status: isApprove
              ? project_status_enum.ACTIVE
              : project_status_enum.ARCHIVED,
          },
        });
      }

      if (request.type === approval_request_type_enum.ORGANIZATION) {
        await tx.organization_profile.update({
          where: { id: request.entity_id },
          data: {
            verification_status: isApprove
              ? verification_status_enum.VERIFIED
              : verification_status_enum.REJECTED,
          },
        });
      }

      if (request.type === approval_request_type_enum.VOLUNTEER && isApprove) {
        await tx.volunteer_profile.update({
          where: { id: request.entity_id },
          data: { is_verified: true },
        });
      }
    });
  }
}
