import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectQueryAdminDto } from './dto/project-query.admin.dto';
import { CreateProjectAdminDto } from './dto/create-project.admin.dto';
import { UpdateProjectDto } from '../../project/dto/update-project.dto';
import { Prisma, project_status_enum } from '@prisma/client';

@Injectable()
export class ProjectAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProjectQueryAdminDto) {
    const where: Prisma.projectWhereInput = {
      ...(query.status && { status: query.status }),
      ...(query.search && {
        title: { contains: query.search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        take: query.limit,
        skip: query.skip,
        orderBy: { created_at: 'desc' },
        include: {
          organization_profile: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        organization_profile: { select: { id: true, name: true } },
        task: true,
        report: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async create(data: CreateProjectAdminDto) {
    return this.prisma.project.create({
      data: {
        organization_profile: {
          connect: { id: data.organization_profile_id },
        },
        title: data.title,
        description: data.description,
        status: data.status,
        starts_at: data.starts_at,
        ends_at: data.ends_at,
      },
    });
  }

  async update(id: number, data: UpdateProjectDto) {
    await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.starts_at !== undefined && { starts_at: data.starts_at }),
        ...(data.ends_at !== undefined && { ends_at: data.ends_at }),
        updated_at: new Date(),
      },
    });
  }

  async updateStatus(id: number, status: project_status_enum) {
    await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.project.delete({ where: { id } });
  }
}
