import { Injectable } from '@nestjs/common';
import { Prisma, project_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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

  async updateProjectFull(id: number, data: CreateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: {
        organization_profile_id: data.organization_profile_id,
        title: data.title,
        description: data.description,
        status: data.status,
        starts_at: data.starts_at ? new Date(data.starts_at) : null,
        ends_at: data.ends_at ? new Date(data.ends_at) : null,
        updated_at: new Date(),
      },
    });
  }

  async updateProjectPartial(id: number, data: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.starts_at !== undefined && {
          starts_at: data.starts_at ? new Date(data.starts_at) : null,
        }),
        ...(data.ends_at !== undefined && {
          ends_at: data.ends_at ? new Date(data.ends_at) : null,
        }),
        updated_at: new Date(),
      },
    });
  }

  async deleteProject(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
