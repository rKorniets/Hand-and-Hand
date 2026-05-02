import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getMyNotifications(currentUser: RequestUser) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: { user_id: currentUser.id },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.notification.count({
        where: { user_id: currentUser.id },
      }),
    ]);

    return { data, total };
  }

  async getUnreadCount(currentUser: RequestUser) {
    const count = await this.prisma.notification.count({
      where: { user_id: currentUser.id, is_read: false },
    });
    return { count };
  }

  async markAsRead(id: number, currentUser: RequestUser) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    if (notification.user_id !== currentUser.id) {
      throw new ForbiddenException('Немає доступу до цього сповіщення');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });
  }

  async markAllAsRead(currentUser: RequestUser) {
    return this.prisma.notification.updateMany({
      where: { user_id: currentUser.id, is_read: false },
      data: { is_read: true },
    });
  }

  async delete(id: number, currentUser: RequestUser) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    if (notification.user_id !== currentUser.id) {
      throw new ForbiddenException('Немає прав на видалення');
    }

    return this.prisma.notification.delete({ where: { id } });
  }

  async getOrgNotifications(orgId: number) {
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

  async markOrgAsRead(id: number, orgId: number) {
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

  async markAllOrgAsRead(orgId: number) {
    return this.prisma.notification_organization.updateMany({
      where: { organization_id: orgId, is_read: false },
      data: { is_read: true },
    });
  }

  async deleteOrgNotification(id: number, orgId: number) {
    const notification = await this.prisma.notification_organization.findFirst({
      where: { id, organization_id: orgId },
    });

    if (!notification) {
      throw new NotFoundException(`Сповіщення не знайдено`);
    }

    return this.prisma.notification_organization.delete({ where: { id } });
  }

  async create(data: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        user_id: data.user_id,
        message: data.message,
        type: data.type || 'GENERAL',
      },
    });
  }
}
