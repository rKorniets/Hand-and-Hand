import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma, project_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  private async validateOwnership(id: number, currentUser: RequestUser) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        organization_profile: { select: { user_id: true } },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.organization_profile.user_id !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to access this project',
      );
    }

    return project;
  }

  async getProjects(
    limit: number,
    skip: number,
    status?: project_status_enum,
    search?: string,
  ) {
    const whereClause: Prisma.projectWhereInput = {
      ...(status && { status }),
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

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

  async updateProject(
    id: number,
    data: CreateProjectDto,
    currentUser: RequestUser,
  ) {
    await this.validateOwnership(id, currentUser);

    return this.prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        starts_at: data.starts_at,
        ends_at: data.ends_at,
        updated_at: new Date(),
      },
    });
  }

  async deleteProject(id: number, currentUser: RequestUser) {
    await this.validateOwnership(id, currentUser);

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

    try {
      return await this.prisma.project_registration.create({
        data: {
          project_id: projectId,
          user_id: userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'You are already registered for this project',
        );
      }
      throw error;
    }
  }

  async unregisterFromProject(projectId: number, userId: number) {
    // Оскільки унікального ключа project_id_user_id немає, використовуємо findFirst
    const registration = await this.prisma.project_registration.findFirst({
      where: {
        project_id: projectId,
        user_id: userId,
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
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
