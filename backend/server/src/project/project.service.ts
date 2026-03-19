import { Injectable } from '@nestjs/common';
import { Prisma, project_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProjects(limit: number, skip: number, status?: project_status_enum) {
    const whereClause: Prisma.projectWhereInput = {};

    if (status !== undefined) {
      whereClause.status = status;
    }

    return this.prisma.project.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
