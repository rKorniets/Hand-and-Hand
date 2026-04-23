import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, report_type_enum } from '@prisma/client';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateOwnership(id: number, currentUser: RequestUser) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        organization_profile: { select: { user_id: true } },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    if (report.organization_profile.user_id !== currentUser.id) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async findAll(
    type?: report_type_enum,
    limit?: number,
    skip?: number,
    search?: string,
  ) {
    const whereClause: Prisma.reportWhereInput = {
      ...(type && { type }),
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.report.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    return this.prisma.report.findUnique({
      where: { id },
    });
  }

  async create(data: CreateReportDto) {
    return this.prisma.report.create({
      data: { ...data, published_at: data.published_at ?? new Date() },
    });
  }

  async update(id: number, data: UpdateReportDto, currentUser: RequestUser) {
    await this.validateOwnership(id, currentUser);

    return this.prisma.report.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.file_url !== undefined && { file_url: data.file_url }),
        ...(data.published_at !== undefined && {
          published_at: data.published_at,
        }),
      },
    });
  }

  async remove(id: number, currentUser: RequestUser) {
    await this.validateOwnership(id, currentUser);

    return this.prisma.report.delete({ where: { id } });
  }
}
