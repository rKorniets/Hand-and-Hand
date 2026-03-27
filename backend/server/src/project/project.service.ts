import { Injectable } from '@nestjs/common';
import { Prisma, project_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProjects(limit: number, skip: number, status?: project_status_enum) {
    const whereClause: Prisma.projectWhereInput = status ? { status } : {};

    return await this.prisma.project.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: {
        created_at: 'desc',
      },
    });
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
}
