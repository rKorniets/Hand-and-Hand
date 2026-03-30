import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, warning_status_enum } from '@prisma/client';
import { Create_warningDto } from './dto/create_warning.dto';
import { Update_warningDto } from './dto/update_warning.dto';

@Injectable()
export class WarningService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: warning_status_enum) {
    const whereClause: Prisma.warningsWhereInput = status ? { status } : {};
    return this.prisma.warnings.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.warnings.findUnique({
      where: { id },
    });
  }

  async create(data: Create_warningDto) {
    return this.prisma.warnings.create({ data });
  }

  async update(id: number, data: Update_warningDto) {
    return this.prisma.warnings.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.warnings.delete({
      where: { id },
    });
  }
}
