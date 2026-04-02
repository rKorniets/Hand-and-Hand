import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, project_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProjects(limit: number, skip: number, status?: project_status_enum) {
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
      include: {
        _count: { select: { project_registration: true } },
      },
    });
  }

  async registerForProject(projectId: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project was not found');
    }

    const existing = await this.prisma.project_registration.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
        },
      },
    });
    if (existing) {
      throw new ConflictException('You are already registered for this project');
    }

    return this.prisma.project_registration.create({
      data: {
        project_id: projectId,
        user_id: userId,
      },
    });
  }

  async unregisterFromProject(projectId: number, userId: number) {
    const registration = await this.prisma.project_registration.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
        },
      },
    });
    if (!registration) {
      throw new NotFoundException('Registration was not found');
    }

    return this.prisma.project_registration.delete({
      where: { id: registration.id },
    });
  }

  async getProjectRegistrations(projectId: number) {
    return this.prisma.project_registration.findMany({
      where: { project_id: projectId },
      include: {
        app_user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
          },
        },
      },
      orderBy: { registered_at: 'desc' },
    });
  }
}
