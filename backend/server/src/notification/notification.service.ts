import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { notification_type_enum } from '@prisma/client';

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
      throw new ForbiddenException(
        'You do not have permission to access this notification',
      );
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

  async create(data: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        user_id: data.user_id,
        message: data.message,
        type: data.type ?? notification_type_enum.GENERAL,
      },
    });
  }
  async update(id: number, data: UpdateNotificationDto) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        ...(data.user_id && { user_id: data.user_id }),
        ...(data.message && { message: data.message }),
        ...(data.type && { type: data.type }),
      },
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
      throw new ForbiddenException(
        'You do not have permission to delete this notification',
      );
    }

    return this.prisma.notification.delete({ where: { id } });
  }
}
