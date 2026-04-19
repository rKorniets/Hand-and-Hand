import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, warning_status_enum, user_role_enum } from '@prisma/client';

@Injectable()
export class WarningService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    currentUser: { id: number; role: user_role_enum },
    status?: warning_status_enum,
    limit?: number,
    skip?: number,
    search?: string,
  ) {
    const whereClause: Prisma.warningsWhereInput = {
      ...(status && { status }),
      ...(currentUser.role === user_role_enum.VOLUNTEER && {
        user_id: currentUser.id,
      }),
      ...(search && {
        reason: { contains: search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.warnings.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.warnings.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number, currentUser: { id: number; role: user_role_enum }) {
    const warning = await this.prisma.warnings.findUnique({ where: { id } });
    if (
      currentUser.role === user_role_enum.VOLUNTEER &&
      warning?.user_id !== currentUser.id
    ) {
      throw new ForbiddenException('Access denied to this warning');
    }
    return warning;
  }
}
