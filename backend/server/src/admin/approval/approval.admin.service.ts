import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApprovalQueryDto } from './dto/approval-query.dto';
import { Prisma, approval_request_status_enum } from '@prisma/client';

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

    return request;
  }

  async approve(id: number, adminUserId: number) {
    await this.findOne(id);

    return this.prisma.approval_request.update({
      where: { id },
      data: {
        status: approval_request_status_enum.APPROVED,
        reviewed_by: adminUserId,
        reviewed_at: new Date(),
      },
    });
  }

  async reject(id: number, adminUserId: number, reason: string) {
    await this.findOne(id);

    return this.prisma.approval_request.update({
      where: { id },
      data: {
        status: approval_request_status_enum.REJECTED,
        reviewed_by: adminUserId,
        reviewed_at: new Date(),
        rejection_reason: reason,
      },
    });
  }
}
