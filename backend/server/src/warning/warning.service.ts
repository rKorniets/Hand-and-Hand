import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, warning_status_enum, user_role_enum } from '@prisma/client';
import { Create_warningDto } from './dto/create_warning.dto';
import { Update_warningDto } from './dto/update_warning.dto';

@Injectable()
export class WarningService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    currentUser: { id: number; role: user_role_enum },
    status?: warning_status_enum,
  ) {
    const whereClause: Prisma.warningsWhereInput = status ? { status } : {};
    if (currentUser.role === user_role_enum.VOLUNTEER) {
      whereClause.user_id = currentUser.id;
    }
    return this.prisma.warnings.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number, currentUser: { id: number; role: user_role_enum }) {
    const warning = await this.prisma.warnings.findUnique({ where: { id } });
    if (
      currentUser.role === user_role_enum.VOLUNTEER &&
      warning?.user_id !== currentUser.id
    ) {
      throw new ForbiddenException('Немає доступу до цього попередження');
    }
    return warning;
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
