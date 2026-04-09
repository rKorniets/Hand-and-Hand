import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApprovalQueryDto } from './dto/approval-query.dto';
import { Prisma } from '@prisma/client';

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
            select: { id: true, email: true, first_name: true, last_name: true, role: true },
          },
          reviewer: {
            select: { id: true, email: true, first_name: true, last_name: true },
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
          select: { id: true, email: true, first_name: true, last_name: true, role: true },
        },
        reviewer: {
          select: { id: true, email: true, first_name: true, last_name: true },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Заявку з ID ${id} не знайдено`);
    }

    return request;
  }

  async approve(id: number, adminUserId: number) {
    const request = await this.findOne(id);

    return this.prisma.approval_request.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewed_by: adminUserId,
        reviewed_at: new Date(),
      },
    });
  }

  async reject(id: number, adminUserId: number, reason: string) {
    const request = await this.findOne(id);

    return this.prisma.approval_request.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewed_by: adminUserId,
        reviewed_at: new Date(),
        rejection_reason: reason,
      },
    });
  }
}
