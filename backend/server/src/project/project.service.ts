import { Injectable } from '@nestjs/common';
import { Prisma, project_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProjects(limit: number, status?: project_status_enum) {
    const whereClause: Prisma.projectWhereInput = status ? { status } : {};

    return await this.prisma.project.findMany({
      where: whereClause,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
