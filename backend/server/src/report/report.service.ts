import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, report_type_enum } from '@prisma/client';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: report_type_enum) {
    const whereClause: Prisma.reportWhereInput = type ? { type } : {};
    return this.prisma.report.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.report.findUnique({
      where: { id },
    });
  }

  async create(data: CreateReportDto) {
    return this.prisma.report.create({
      data,
    });
  }

  async update(id: number, data: UpdateReportDto) {
    return this.prisma.report.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.report.delete({
      where: { id },
    });
  }
}
