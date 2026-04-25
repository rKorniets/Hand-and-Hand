import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectQueryAdminDto } from './dto/project-query.admin.dto';
import { CreateProjectAdminDto } from './dto/create-project.admin.dto';
import { UpdateProjectDto } from '../../project/dto/update-project.dto';
import { Prisma, project_status_enum } from '@prisma/client';

@Injectable()
export class ProjectAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    params: ProjectQueryAdminDto & {
      limit?: number;
      skip?: number;
      search?: string;
    },
  ) {
    const whereClause: Prisma.projectWhereInput = {
      ...(params.status && { status: params.status }),
      ...(params.search && {
        title: { contains: params.search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where: whereClause,
        take: params.limit,
        skip: params.skip,
        orderBy: { created_at: 'desc' },
        include: {
          organization_profile: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.project.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findPending() {
    const requests = await this.prisma.approval_request.findMany({
      where: {
        type: 'PROJECT',
        status: 'PENDING',
      },
      orderBy: { created_at: 'desc' },
      include: {
        submitter: {
          select: {
            id: true,
            email: true,
            organization_profile: {
              select: { name: true },
            },
          },
        },
      },
    });

    return Promise.all(
      requests.map(async (req) => {
        const project = await this.prisma.project.findUnique({
          where: { id: req.entity_id },
          select: { id: true, title: true, description: true, status: true },
        });
        return { ...req, project };
      }),
    );
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

  // noinspection DuplicatedCode
  async create(data: CreateProjectAdminDto) {
    if (!data.organization_profile_id) {
      throw new BadRequestException('organization_profile_id is required');
    }
    return this.prisma.project.create({
      data: {
        organization_profile: {
          connect: { id: data.organization_profile_id },
        },
        title: data.title,
        description: data.description,
        status: data.status,
        starts_at: data.starts_at ? new Date(data.starts_at) : null,
        ends_at: data.ends_at ? new Date(data.ends_at) : null,
      },
    });
  }

  // noinspection DuplicatedCode
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
