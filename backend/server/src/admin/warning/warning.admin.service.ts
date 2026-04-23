import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarningAdminDto } from './dto/create-warning.admin.dto';
import { WarningQueryAdminDto } from './dto/warning-query.admin.dto';
import { Prisma, warning_status_enum } from '@prisma/client';

@Injectable()
export class WarningAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    params: WarningQueryAdminDto & {
      limit?: number;
      skip?: number;
      search?: string;
    },
  ) {
    const whereClause: Prisma.warningsWhereInput = {
      ...(params.user_id && { user_id: params.user_id }),
      ...(params.status && { status: params.status }),
      ...(params.severity && { severity: params.severity }),
      ...(params.search && {
        OR: [
          { reason: { contains: params.search, mode: 'insensitive' } },
          {
            app_user_warnings_user_idToapp_user: {
              email: { contains: params.search, mode: 'insensitive' },
            },
          },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.warnings.findMany({
        where: whereClause,
        take: params.limit,
        skip: params.skip,
        orderBy: { created_at: 'desc' },
        include: {
          app_user_warnings_user_idToapp_user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
          app_user_warnings_created_byToapp_user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      this.prisma.warnings.count({ where: whereClause }),
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
      throw new NotFoundException(`Warning with ID ${id} not found`);
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
        status: warning_status_enum.RESOLVED,
        resolved_at: new Date(),
      },
    });
  }

  async cancel(id: number) {
    await this.findOne(id);

    return this.prisma.warnings.update({
      where: { id },
      data: { status: warning_status_enum.CANCELLED },
    });
  }
}
