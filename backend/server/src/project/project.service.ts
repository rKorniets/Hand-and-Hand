import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, project_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

function parseDate(value: string, fieldName: string): Date {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new BadRequestException(
      `Invalid date format for field "${fieldName}": ${value}`,
    );
  }
  return date;
}

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
        starts_at: parseDate(data.starts_at, 'starts_at'),
        ends_at: parseDate(data.ends_at, 'ends_at'),
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
          starts_at: data.starts_at
            ? parseDate(data.starts_at, 'starts_at')
            : null,
        }),
        ...(data.ends_at !== undefined && {
          ends_at: data.ends_at ? parseDate(data.ends_at, 'ends_at') : null,
        }),
        updated_at: new Date(),
      },
    });
  }

  async deleteProject(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
