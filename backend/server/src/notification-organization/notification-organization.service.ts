import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrgNotificationDto } from './dto/create-notification-organization.dto';

@Injectable()
export class NotificationOrganizationService {
  constructor(private prisma: PrismaService) {}

  async getByOrgId(orgId: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.notification_organization.findMany({
        where: { organization_id: orgId },
        orderBy: { created_at: 'desc' },
        include: {
          project_registration: {
            include: {
              app_user: {
                select: {
                  first_name: true,
                  last_name: true,
                  avatar_url: true,
                },
              },
            },
          },
          project: {
            select: {
              title: true,
            },
          },
        },
      }),
      this.prisma.notification_organization.count({
        where: { organization_id: orgId },
      }),
    ]);

    const mappedData = data.map((n) => ({
      ...n,
      registration_data: n.project_registration,
    }));

    return { data: mappedData, total };
  }

  async markAsRead(id: number, orgId: number) {
    const notification = await this.prisma.notification_organization.findFirst({
      where: { id, organization_id: orgId },
    });

    if (!notification) {
      throw new NotFoundException(`Сповіщення не знайдено`);
    }

    return this.prisma.notification_organization.update({
      where: { id },
      data: { is_read: true },
    });
  }

  async markAllAsRead(orgId: number) {
    return this.prisma.notification_organization.updateMany({
      where: { organization_id: orgId, is_read: false },
      data: { is_read: true },
    });
  }

  async delete(id: number, orgId: number) {
    const notification = await this.prisma.notification_organization.findFirst({
      where: { id, organization_id: orgId },
    });

    if (!notification) {
      throw new NotFoundException(`Сповіщення не знайдено`);
    }

    return this.prisma.notification_organization.delete({
      where: { id },
    });
  }

  async create(dto: CreateOrgNotificationDto) {
    return this.prisma.notification_organization.create({
      data: {
        organization_id: dto.organization_id,
        message: dto.message,
        type: dto.type || 'GENERAL',
      },
    });
  }
}
