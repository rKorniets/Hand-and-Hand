import { Injectable } from '@nestjs/common';
import { Prisma, project_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProjects(
    limit: number,
    skip: number = 0,
    status?: project_status_enum,
  ) {
    const whereClause: Prisma.projectWhereInput = status ? { status } : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.project.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async createProject(data: CreateProjectDto) {
    return this.prisma.project.create({ data });
  }

  async updateProject(id: number, data: CreateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
    });
  }

  async deleteProject(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }

  async getProjectById(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }
}
