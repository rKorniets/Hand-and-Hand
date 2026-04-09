import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarningAdminDto } from './dto/create-warning.admin.dto';
import { WarningQueryAdminDto } from './dto/warning-query.admin.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WarningAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: WarningQueryAdminDto) {
    const where: Prisma.warningsWhereInput = {
      ...(query.user_id && { user_id: query.user_id }),
      ...(query.status && { status: query.status }),
      ...(query.severity && { severity: query.severity }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.warnings.findMany({
        where,
        take: query.limit,
        skip: query.skip,
        orderBy: { created_at: 'desc' },
        include: {
          app_user_warnings_user_idToapp_user: {
            select: { id: true, email: true, first_name: true, last_name: true },
          },
          app_user_warnings_created_byToapp_user: {
            select: { id: true, email: true, first_name: true, last_name: true },
          },
        },
      }),
      this.prisma.warnings.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const warning = await this.prisma.warnings.findUnique({
      where: { id },
      include: {
        app_user_warnings_user_idToapp_user: {
          select: { id: true, email: true, first_name: true, last_name: true },
        },
        app_user_warnings_created_byToapp_user: {
          select: { id: true, email: true, first_name: true, last_name: true },
        },
      },
    });

    if (!warning) {
      throw new NotFoundException(`Попередження з ID ${id} не знайдено`);
    }

    return warning;
  }

  async create(dto: CreateWarningAdminDto, adminUserId: number) {
    return this.prisma.warnings.create({
      data: {
        user_id: dto.user_id,
        created_by: adminUserId,
        reason: dto.reason,
        description: dto.description,
        severity: dto.severity,
        expires_at: dto.expires_at,
        related_entity_type: dto.related_entity_type,
        related_entity_id: dto.related_entity_id,
      },
    });
  }

  async resolve(id: number) {
    await this.findOne(id);

    return this.prisma.warnings.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolved_at: new Date(),
      },
    });
  }

  async cancel(id: number) {
    await this.findOne(id);

    return this.prisma.warnings.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
