import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReportAdminDto } from './dto/create-report.admin.dto';
import { UpdateReportDto } from '../../report/dto/update-report.dto';
import { Prisma, report_type_enum } from '@prisma/client';

@Injectable()
export class ReportAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: report_type_enum) {
    const where: Prisma.reportWhereInput = type ? { type } : {};

    return this.prisma.report.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        organization_profile: { select: { id: true, name: true } },
        project: { select: { id: true, title: true } },
      },
    });
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

  async create(data: CreateReportAdminDto) {
    return this.prisma.report.create({
      data: {
        title: data.title,
        type: data.type,
        file_url: data.file_url,
        published_at: data.published_at,
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

  async update(id: number, data: UpdateReportDto) {
    await this.findOne(id);

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
