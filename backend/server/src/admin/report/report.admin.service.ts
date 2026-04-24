import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReportAdminDto } from './dto/create-report.admin.dto';
import { UpdateReportDto } from '../../report/dto/update-report.dto';
import { Prisma, report_type_enum } from '@prisma/client';

@Injectable()
export class ReportAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    type?: report_type_enum;
    limit?: number;
    skip?: number;
    search?: string;
  }) {
    const whereClause: Prisma.reportWhereInput = {
      ...(params.type && { type: params.type }),
      ...(params.search && {
        title: { contains: params.search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where: whereClause,
        take: params.limit,
        skip: params.skip,
        orderBy: { created_at: 'desc' },
        include: {
          organization_profile: { select: { id: true, name: true } },
          project: { select: { id: true, title: true } },
        },
      }),
      this.prisma.report.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        organization_profile: { select: { id: true, name: true } },
        project: { select: { id: true, title: true } },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  // noinspection DuplicatedCode
  async create(data: CreateReportAdminDto) {
    return this.prisma.report.create({
      data: {
        title: data.title,
        type: data.type,
        file_url: data.file_url,
        published_at: data.published_at ?? new Date(),
        organization_profile: {
          connect: { id: data.organization_profile_id },
        },
        ...(data.project_id && {
          project: {
            connect: { id: data.project_id },
          },
        }),
      },
    });
  }

  // noinspection DuplicatedCode
  async update(id: number, data: UpdateReportDto) {
    await this.findOne(id);
    // noinspection DuplicatedCode
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

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.report.delete({ where: { id } });
  }
}
