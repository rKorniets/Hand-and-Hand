import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
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
    limit?: number,
    skip?: number,
    status?: project_status_enum,
    search?: string,
    organizationProfileId?: number,
  ) {
    const approvedRequests = await this.prisma.approval_request.findMany({
      where: { type: 'PROJECT', status: 'APPROVED' },
      select: { entity_id: true },
    });

    const approvedProjectIds = approvedRequests.map((r) => r.entity_id);

    const whereClause: Prisma.projectWhereInput = {
      id: { in: approvedProjectIds },
      ...(status && { status }),
      ...(organizationProfileId && {
        organization_profile_id: organizationProfileId,
      }),
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
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

  async createProject(data: CreateProjectDto, currentUser: RequestUser) {
    const orgProfile = await this.prisma.organization_profile.findFirst({
      where: { id: data.organization_profile_id, user_id: currentUser.id },
      select: { id: true },
    });

    if (!orgProfile) {
      throw new ForbiddenException(
        'Не знайдено профіль організації для цього користувача',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      let locationId: number | undefined;

      if (data.location) {
        const loc = await tx.location.create({
          data: {
            city: data.location.city,
            address: data.location.address,
            region: data.location.region,
            lat: data.location.lat ?? null,
            lng: data.location.lng ?? null,
          },
        });
        locationId = loc.id;
      }

      const project = await tx.project.create({
        data: {
          organization_profile_id: data.organization_profile_id,
          title: data.title,
          description: data.description,
          main_content: data.main_content,
          what_volunteers_will_do: data.what_volunteers_will_do,
          why_its_important: data.why_its_important,
          time: data.time,
          application_deadline: data.application_deadline
            ? new Date(data.application_deadline)
            : null,
          partners: data.partners,
          image_url: data.image_url,
          status: 'DRAFT',
          starts_at: data.starts_at ? new Date(data.starts_at) : null,
          ends_at: data.ends_at ? new Date(data.ends_at) : null,
          ...(locationId && { location_id: locationId }),
          ...(data.category_id && { category_id: data.category_id }),
        },
      });

      await tx.approval_request.create({
        data: {
          type: 'PROJECT',
          status: 'PENDING',
          entity_id: project.id,
          submitted_by: currentUser.id,
        },
      });

      return project;
    });
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
        main_content: data.main_content,
        status: data.status,
        starts_at: data.starts_at ? new Date(data.starts_at) : null,
        ends_at: data.ends_at ? new Date(data.ends_at) : null,
        updated_at: new Date(),
      },
    });
  }

  async deleteProject(id: number, currentUser: RequestUser) {
    await this.validateOwnership(id, currentUser);
    return this.prisma.project.delete({ where: { id } });
  }

  async getProjectById(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        _count: { select: { project_registration: true } },
        location: true,
        category: {
          select: { id: true, name: true },
        },
        organization_profile: {
          select: {
            id: true,
            name: true,
            contact_email: true,
            contact_phone: true,
            mission: true,
            description: true,
            city: true,
            logo_url: true,
          },
        },
        project_registration: {
          take: 10,
          orderBy: { created_at: 'desc' },
          include: {
            app_user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                volunteer_profile: {
                  select: { avatar_url: true },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return {
      ...project,
      organization_profile: project.organization_profile
        ? {
            ...project.organization_profile,
            email: project.organization_profile.contact_email,
          }
        : null,
      volunteers: project.project_registration.map((r) => ({
        id: r.app_user.id,
        full_name:
          `${r.app_user.first_name ?? ''} ${r.app_user.last_name ?? ''}`.trim(),
        avatar_url: r.app_user.volunteer_profile?.avatar_url ?? null,
      })),
    };
  }

  async registerForProject(projectId: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project was not found');
    }
    if (project.status === project_status_enum.DRAFT) {
      throw new BadRequestException('Project is not published yet');
    }
    if (project.status !== project_status_enum.ACTIVE) {
      throw new BadRequestException('Project is not accepting registrations');
    }
    try {
      return await this.prisma.project_registration.create({
        data: { project_id: projectId, user_id: userId },
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
    const registration = await this.prisma.project_registration.findFirst({
      where: { project_id: projectId, user_id: userId },
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
          select: { id: true, first_name: true, last_name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
